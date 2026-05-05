import { Inngest } from "inngest";
import Attendance from "../models/attendence-modal.js";
import Employee from "../models/employee-modal.js";
import Leave from "../models/leave-modal.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "empower-track" });

// auto checkout for employee
const autoCheckout = inngest.createFunction(
  {
    id: "auto-checkout",
    triggers: [{ event: "employee/checkout" }],
  },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    console.log(`Auto checkout for employee ${employeeId}`);

    await step.sleep("8h");

    let attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      console.log("Attendance not found");
      return;
    }

    if (!attendance?.checkOut){
      const employee= await Employee.findById(employeeId);
      sendEmail({
        to: employee.email,
        subject: "Auto Check-out Notification",
        text: `Dear ${employee.firstName},\n\nOur records indicate that you have not checked out for today. For accurate attendance tracking, we have automatically checked you out at 6:00 PM. If this is an error, please contact HR.\n\nBest regards,\nHR Team`,
      })

    }

    await step.sleep("1h");

    attendance = await Attendance.findById(attendanceId);

    if (!attendance.checkOut) {
      attendance.checkOut = new Date(
        attendance.checkIn.getTime() + 10 * 60 * 60 * 1000
      );
      attendance.workingHours = 8;
      attendance.dayType = "Half Day";
      attendance.status = "LATE";

      await attendance.save();

     
    }
  }
);

//send Email to admin, if admin is not added in 24 hours of seeding the database
const leaveApplicationRemainder = inngest.createFunction(
  {
    id: "leave-application-remainder",
    triggers: [{ event: "leave/pending" }],
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    // wait for 24 hours
    await step.sleepUntil(new Date(Date.now() + 24 * 60 * 60 * 1000));

    const leaveApplication = await Leave.findById(leaveApplicationId);

    if (leaveApplication.status === "PENDING") {
      const employee = await Employee.findById(leaveApplication.employee);
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "Leave Application Reminder",
        text: `Dear ${employee.firstName},\n\nYour leave application submitted on ${leaveApplication.createdAt.toDateString()} is still pending. Please contact your manager for approval.\n\nBest regards,\nHR Team`,
      });
    }
  }
);

// check attendance of employee at 11:30 am and send reminder if employee has not checked in
const attendanceRemainderCron = inngest.createFunction(
  {
    id: "attendance-remainder-cron",
    triggers: [{ cron: "30 5 * * *" }], // 11:30 AM Bangladesh (UTC+6)
  },
  async ({ step }) => {
    // ✅ Step 1: Get BD date range (IMPORTANT FIX)
    const today = await step.run("get-today-date-range-bd", () => {
      const now = new Date();

      // Convert to Bangladesh time (UTC+6)
      const bdOffset = 6 * 60; // minutes
      const localOffset = now.getTimezoneOffset(); // user's env offset
      const bdTime = new Date(now.getTime() + (bdOffset + localOffset) * 60000);

      // Start of BD day
      const startBD = new Date(bdTime);
      startBD.setHours(0, 0, 0, 0);

      // End of BD day
      const endBD = new Date(bdTime);
      endBD.setHours(23, 59, 59, 999);

      // Convert back to UTC for DB query
      const startUTC = new Date(startBD.getTime() - (bdOffset * 60000));
      const endUTC = new Date(endBD.getTime() - (bdOffset * 60000));

      return { startUTC, endUTC };
    });

    // ✅ Step 2: Employees
    const employees = await step.run("get-all-active-employees", async () => {
      const data = await Employee.find({
        employmentStatus: "ACTIVE",
        isDeleted: false,
      }).lean();

      return data.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        email: e.email,
      }));
    });

    // ✅ Step 3: Employees on Leave (Use Set for performance)
    const leaveSet = await step.run("get-employees-on-leave", async () => {
      const leaves = await Leave.find({
        status: "APPROVED",
        startDate: { $lte: today.endUTC },
        endDate: { $gte: today.startUTC },
      }).lean();

      return new Set(leaves.map((l) => l.employee.toString()));
    });

    // ✅ Step 4: Attendance (Use Set)
    const attendanceSet = await step.run("get-attendance", async () => {
      const data = await Attendance.find({
        checkIn: { $gte: today.startUTC, $lte: today.endUTC },
      }).lean();

      return new Set(data.map((a) => a.employee.toString()));
    });

    // ✅ Step 5: Filter Absent (O(n) efficient)
    const absentEmployees = employees.filter(
      (e) => !leaveSet.has(e._id) && !attendanceSet.has(e._id)
    );

    // ✅ Step 6: Send Emails (parallel optimization)
    if (absentEmployees.length > 0) {
      await Promise.all(
        absentEmployees.map((emp) =>
          sendEmail({
            to: emp.email,
            subject: "Attendance Reminder",
            text: `Dear ${emp.firstName},

Our records indicate that you have not checked in for today.
Please check in as soon as possible.

Best regards,
HR Team`,
          })
        )
      );
    }

    // ✅ Final Return
    return {
      summary: {
        totalActive: employees.length,
        onLeave: leaveSet.size,
        checkedIn: attendanceSet.size,
        absent: absentEmployees.length,
      },
    };
  }
);
export const functions = [
  autoCheckout,
  leaveApplicationRemainder,
  attendanceRemainderCron,
  
];

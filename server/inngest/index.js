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
    triggers: [{ cron: "0 30 5 * * *" }], // 11:30 AM BD
  },
  async ({ step }) => {
    // Step 1: Date range
    const today = await step.run("get-today-date-range", () => {
      const startUTC = new Date();
      startUTC.setUTCHours(0, 0, 0, 0);

      const endUTC = new Date();
      endUTC.setUTCHours(23, 59, 59, 999);

      return { startUTC, endUTC };
    });

    // Step 2: Employees
    const employees = await step.run("get-all-active-employees", async () => {
      const data = await Employee.find({
        employmentStatus: "ACTIVE",
        isDeleted: false,
      }).lean();

      return data.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Leaves
    const employeeIdsOnLeave = await step.run(
      "get-employees-on-leave-today",
      async () => {
        const leaves = await Leave.find({
          status: "APPROVED",
          startDate: { $lte: today.endUTC },
          endDate: { $gte: today.startUTC },
        }).lean();

        return leaves.map((leave) => leave.employee.toString());
      }
    );

    // Step 4: Attendance
    const attendances = await step.run("get-todays-attendance", async () => {
      const data = await Attendance.find({
        checkIn: { $gte: today.startUTC, $lte: today.endUTC },
      }).lean();

      return data.map((a) => a.employee.toString());
    });

    // Step 5: Absent filter
    const absentEmployees = employees.filter(
      (e) => !employeeIdsOnLeave.includes(e._id) && !attendances.includes(e._id)
    );

    // step 6: Send remainder email
    if(absentEmployees.length > 0){
      for(const emp of absentEmployees){
        sendEmail({
          to: emp.email,
          subject: "Attendance Reminder",
          text: `Dear ${emp.firstName},\n\nOur records indicate that you have not checked in for today. Please remember to check in as soon as possible.\n\nBest regards,\nHR Team`,
        });
      }
    }

    // ✅ FINAL RETURN (FULL DATA)
    return {
      summary: {
        totalActive: employees.length,
        onLeave: employeeIdsOnLeave.length,
        checkedIn: attendances.length,
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

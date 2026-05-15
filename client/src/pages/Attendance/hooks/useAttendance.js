/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useAttendance.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export const useAttendance = (user) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAttendance = async () => {
    try {
      setTableLoading(true);

      let res;
      if (user?.role === "EMPLOYEE") {
        res = await api.get("/attendance/get-my-attendance");
      } else {
        res = await api.get(
          `/attendance/get-attendance-by-date?date=${selectedDate}`
        );
      }

      setAttendanceRecords(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
      toast.error("Failed to fetch attendance");
    } finally {
      setTableLoading(false);
    }
  };

  const handlePunch = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await api.post("/attendance/check-in-out");
      toast.success(res.data?.message);
      fetchAttendance();
    } catch {
      toast.error("Action failed");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const latest = attendanceRecords[0];

  const isCurrentlyIn =
    latest &&
    !latest.checkOut &&
    new Date(latest.date).toDateString() === new Date().toDateString();

  const hasFinishedToday =
    latest &&
    latest.checkOut &&
    new Date(latest.date).toDateString() === new Date().toDateString();

  const present = attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  );

  const totals = {
    present: present.length,
    absent: attendanceRecords.filter((r) => r.status === "ABSENT").length,
    avgHours:
      present.length > 0
        ? (
            present.reduce((a, b) => a + (b.workingHours || 0), 0) /
            present.length
          ).toFixed(2)
        : "0.00",
  };

  return {
    attendanceRecords,
    currentTime,
    selectedDate,
    setSelectedDate,
    tableLoading,
    processing,
    handlePunch,
    isCurrentlyIn,
    hasFinishedToday,
    totals,
  };
};

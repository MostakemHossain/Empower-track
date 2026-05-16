import Chart from "react-apexcharts";

const AttendanceChart = ({ data }) => {
  const attendanceSeries = [
    {
      name: "Working Hours",
      data:
        data?.attendanceOverview?.map((d) => d.workingHours || 0) || [],
    },
  ];

  const attendanceOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    colors: ["#6366f1"],

    stroke: {
      curve: "smooth",
      width: 3,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },

    xaxis: {
      categories:
        data?.attendanceOverview?.map((d) =>
          new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ) || [],

      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        formatter: (val) => `${val}h`,
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      x: {
        format: "dd MMM",
      },
    },
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Attendance Overview (Last 7 Days)
      </h2>

      <Chart
        options={attendanceOptions}
        series={attendanceSeries}
        type="area"
        height={320}
      />
    </div>
  );
};

export default AttendanceChart;
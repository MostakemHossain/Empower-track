import Chart from "react-apexcharts";

const SummaryChart = ({ data }) => {
  const pieSeries = [
    data?.todayAttendance || 0,
    (data?.totalEmployees || 0) - (data?.todayAttendance || 0),
  ];

  const pieOptions = {
    chart: {
      type: "donut",
    },

    colors: ["#10b981", "#f43f5e"],

    labels: ["Present", "Absent/Leave"],

    legend: {
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Today Summary
      </h2>

      <Chart
        options={pieOptions}
        series={pieSeries}
        type="donut"
        height={320}
      />
    </div>
  );
};

export default SummaryChart;
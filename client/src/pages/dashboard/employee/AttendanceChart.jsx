import Chart from "react-apexcharts";

const AttendanceChart = ({ data, options }) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        My Attendance Overview
      </h2>

      <Chart options={options} series={data} type="area" height={320} />
    </div>
  );
};

export default AttendanceChart;
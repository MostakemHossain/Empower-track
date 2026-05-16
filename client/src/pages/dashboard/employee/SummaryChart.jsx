import Chart from "react-apexcharts";

const SummaryChart = ({ data, options }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Monthly Summary
      </h2>

      <Chart options={options} series={data} type="donut" height={320} />
    </div>
  );
};

export default SummaryChart;
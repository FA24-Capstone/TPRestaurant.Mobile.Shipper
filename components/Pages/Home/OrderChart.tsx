import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface ChartData {
  day: string;
  value: number;
}

interface OrderChartProps {
  chartData: ChartData[];
}

const OrderChart: React.FC<OrderChartProps> = ({ chartData }) => {
  const labels = chartData.map((data) => data.day);
  const dataPoints = chartData.map((data) => data.value);

  return (
    <View className="p-6 mt-10">
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: dataPoints }],
        }}
        width={screenWidth - 40} // Adjust width accordingly
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: () => "#000",
          labelColor: () => "#000",
        }}
        bezier
        style={{ borderRadius: 10 }}
      />
    </View>
  );
};

export default OrderChart;

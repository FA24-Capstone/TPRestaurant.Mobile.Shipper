import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface ChartData {
  day: string;
  completed: number;
  cancelled: number;
}

interface OrderChartProps {
  chartData: ChartData[];
}

const OrderChart: React.FC<OrderChartProps> = ({ chartData }) => {
  const labels = chartData.map((data) => data.day);

  const completedData = chartData.map((data) => data.completed);
  const cancelledData = chartData.map((data) => data.cancelled);

  // Tìm giá trị lớn nhất trong dữ liệu
  const maxDataValue = Math.max(...completedData, ...cancelledData);

  // Kiểm tra nếu giá trị lớn nhất chia hết cho 4 thì yAxisInterval = 1, nếu không thì = 0.5
  const yAxisInterval = maxDataValue % 4 === 0 ? 1 : 0.5;

  // Kiểm tra nếu giá trị lớn nhất chia hết cho 4 thì hiển thị số nguyên, nếu không thì hiển thị số thập phân
  const decimalPlaces = maxDataValue % 4 === 0 ? 0 : 1;

  return (
    <View className="py-6 m-4 rounded-md border-2 border-gray-200">
      <Text
        className="text-center text-sm
       uppercase text-gray-700 font-bold mb-4"
      >
        Biểu đồ số đơn hàng được giao trong tuần
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: completedData,
              color: () => "#388E3C", // Completed Orders - Dark Red
              strokeWidth: 3,
            },

            {
              data: cancelledData,
              color: () => "#D32F2F", // Cancelled Orders - Blue
              strokeWidth: 3,
            },
          ],
          // legend: ["Số đơn hoàn thành", "Số đơn bị huỷ"], // Thêm chú giải
        }}
        width={screenWidth - 50} // Adjust width accordingly
        height={220}
        yAxisSuffix=""
        fromZero={true}
        yAxisInterval={yAxisInterval} // Giảm khoảng cách giữa các ô trên trục y
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: decimalPlaces, // Điều chỉnh số chữ số thập phân hiển thị
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu mặc định cho các thành phần khác
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#fff",
          },
        }}
        bezier
        style={{ borderRadius: 10 }}
      />

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#388E3C" }]} />
          <Text style={styles.legendText} className="text-[#388E3C]">
            Số đơn hoàn thành
          </Text>
        </View>
        {/* <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FFA500" }]} />
          <Text style={styles.legendText}>Pending</Text>
        </View> */}
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#D32F2F" }]} />
          <Text style={styles.legendText} className="text-[#D32F2F]">
            Số đơn bị huỷ
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default OrderChart;

import OrderChart from "@/components/Pages/Home/OrderChart";
import OrderSummary from "@/components/Pages/Home/OrderSummary";
import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  const fakeData = {
    completedOrders: 20,
    pendingOrders: 8,
    chartData: [
      { day: "Mon", value: 6000 },
      { day: "Tue", value: 4000 },
      { day: "Wed", value: 5500 },
      { day: "Thu", value: 15980 },
      { day: "Fri", value: 6000 },
      { day: "Sat", value: 7500 },
      { day: "Sun", value: 5000 },
    ],
    orders: [
      {
        id: "#351",
        distance: "5km",
        address: "S6.03, Vinhomes Grand Park, TP. Thủ Đức, TP. Hồ Chí Minh",
        time: "20 phút",
        status: "pending",
      },
      {
        id: "#352",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "delivering",
      },
      {
        id: "#353",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "delivered",
      },
      {
        id: "#354",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "cancelled",
      },
      {
        id: "#355",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "pending",
      },
      {
        id: "#356",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "pending",
      },
      {
        id: "#357",
        distance: "3km",
        address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
        time: "15 phút",
        status: "pending",
      },
    ],
  };

  return (
    <View className="bg-white flex-1 mt-10">
      <WelcomeHeader />
      <OrderSummary
        completedOrders={fakeData.completedOrders}
        pendingOrders={fakeData.pendingOrders}
      />
      <OrderChart chartData={fakeData.chartData} />
      {/* Truyền limit={2} để giới hạn số đơn hiển thị */}
      <View className="flex-row justify-between mx-6">
        <Text className="font-semibold text-lg">Danh sách đơn cần giao</Text>
        {/* Thêm sự kiện nhấn vào "Tất cả" */}
        <TouchableOpacity onPress={() => router.push("/order-list")}>
          <Text className="font-semibold text-base italic text-[#9A0E1D]">
            Tất cả
          </Text>
        </TouchableOpacity>
      </View>
      <OrderList
        orders={fakeData.orders}
        limit={2}
        onViewDetail={() => router.push("/order-detail")}
      />
    </View>
  );
};

export default HomeScreen;

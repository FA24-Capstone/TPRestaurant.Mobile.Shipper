import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const OrderListDelivery: React.FC = () => {
  const router = useRouter();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]); // Quản lý danh sách các đơn đã chọn
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const orders = [
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
  ];

  // Lọc danh sách đơn hàng theo trạng thái được chọn
  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  // Tạo tiêu đề động dựa trên trạng thái
  const getTitle = (status: string) => {
    switch (status) {
      case "pending":
        return "Danh sách đơn cần giao";
      case "delivering":
        return "Danh sách đơn đang giao";
      case "delivered":
        return "Danh sách đơn đã giao";
      case "cancelled":
        return "Danh sách đơn đã hủy";
      default:
        return "Danh sách đơn hàng";
    }
  };

  // Hàm để xử lý chọn / bỏ chọn một đơn hàng
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId); // Bỏ chọn đơn hàng nếu đã được chọn
      } else {
        return [...prevSelectedOrders, orderId]; // Thêm đơn hàng vào danh sách chọn
      }
    });
  };

  return (
    <View className="flex-1 bg-white mt-10">
      <WelcomeHeader />
      {/* Nút tabs cho các trạng thái */}
      <View className="flex-row justify-around mx-4 my-4">
        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${
            selectedStatus === "pending" ? "bg-[#A1011A]" : "bg-gray-200"
          }`}
          onPress={() => setSelectedStatus("pending")}
        >
          <Text
            className={`text-center font-semibold text-base ${
              selectedStatus === "pending" ? "text-white" : "text-gray-700"
            }`}
          >
            Chờ giao
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${
            selectedStatus === "delivering" ? "bg-[#A1011A]" : "bg-gray-200"
          }`}
          onPress={() => setSelectedStatus("delivering")}
        >
          <Text
            className={`text-center font-semibold text-base ${
              selectedStatus === "delivering" ? "text-white" : "text-gray-700"
            }`}
          >
            Đang giao
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${
            selectedStatus === "delivered" ? "bg-[#A1011A]" : "bg-gray-200"
          }`}
          onPress={() => setSelectedStatus("delivered")}
        >
          <Text
            className={`text-center font-semibold text-base ${
              selectedStatus === "delivered" ? "text-white" : "text-gray-700"
            }`}
          >
            Đã giao
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-2 px-4 rounded-lg ${
            selectedStatus === "cancelled" ? "bg-[#A1011A]" : "bg-gray-200"
          }`}
          onPress={() => setSelectedStatus("cancelled")}
        >
          <Text
            className={`text-center font-semibold text-base ${
              selectedStatus === "cancelled" ? "text-white" : "text-gray-700"
            }`}
          >
            Đã huỷ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tiêu đề động dựa trên trạng thái */}
      <Text className="font-semibold uppercase text-xl mt-2 mx-4">
        {getTitle(selectedStatus)}
      </Text>

      {/* Danh sách đơn */}
      <OrderList
        orders={filteredOrders}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={selectedStatus === "pending"}
        onViewDetail={() => router.push("/order-detail")}
      />

      {/* Hiển thị nút "Tối ưu chặng đường" khi có từ 2 đơn hàng được chọn */}
      {selectedOrders.length >= 2 && (
        <TouchableOpacity className="bg-white border-[#A1011A] border-2 py-3 mx-4 rounded-lg my-4">
          <Text className="text-[#A1011A] text-center font-semibold text-lg">
            Tối ưu chặng đường
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderListDelivery;

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderItemProps } from "@/app/types/order_type";
import { Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";

// Hàm chuyển đổi trạng thái sang tiếng Việt và trả về màu tương ứng
const getStatusTextAndColor = (status: string) => {
  switch (status) {
    case "pending":
      return { text: "Chờ giao hàng", color: "#FFA500" }; // Màu cam cho "Chờ giao hàng"
    case "delivering":
      return { text: "Đang giao hàng", color: "#00BFFF" }; // Màu xanh dương cho "Đang giao hàng"
    case "delivered":
      return { text: "Đã giao hàng", color: "#32CD32" }; // Màu xanh lá cho "Đã giao hàng"
    case "cancelled":
      return { text: "Đã hủy", color: "#FF0000" }; // Màu đỏ cho "Đã hủy"
    default:
      return { text: "Trạng thái không xác định", color: "#000000" }; // Màu đen cho trạng thái không xác định
  }
};

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  selected,
  onSelect,
  isPending,
  onViewDetail,
}) => {
  const router = useRouter();
  // Giới hạn địa chỉ thành 1 dòng (khoảng 40 ký tự)
  const maxLength = 40;
  const truncatedAddress =
    order.address.length > maxLength
      ? order.address.slice(0, maxLength) + "..."
      : order.address;

  // Lấy text và màu từ hàm getStatusTextAndColor
  const { text: statusText, color: statusColor } = getStatusTextAndColor(
    order.status
  );

  const handleViewDetail = () => {
    console.log("View detail button pressed!");
    router.push("order-detail");
  };

  return (
    <View className=" mt-4 flex-row items-center">
      {/* Checkbox để chọn đơn */}
      {isPending && (
        <Checkbox
          status={selected ? "checked" : "unchecked"}
          onPress={() => onSelect(order.id)}
          color="#A1011A"
          uncheckedColor="gray"
        />
      )}
      <View
        className={`bg-[#FAFAFA] p-3 rounded-lg shadow ${
          isPending ? "w-[90%]" : "w-full"
        }`}
      >
        <View className="flex-1 ">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-lg " style={{ color: statusColor }}>
              {order.id} - {statusText}
            </Text>
            <Text className="text-gray-700 font-semibold text-lg ">
              {order.time}
            </Text>
          </View>
          <View className=" my-2 flex-row">
            <Image
              source={require("../../../assets/icon/bike.png")}
              className="w-12 h-12"
            />
            <View className="w-[90%]">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="green"
                />
                <Text className="text-gray-600">({order.distance})</Text>
              </View>
              <Text className="ml-2 text-gray-700 font-medium">
                {truncatedAddress}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-200 w-[45%] py-2 px-4 rounded-lg"
              onPress={onViewDetail}
            >
              <Text className="text-lg text-center text-gray-600 font-semibold uppercase">
                Xem
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#A1011A] w-[45%] py-2 px-4 rounded-lg">
              <Text className="text-white text-lg text-center font-semibold uppercase">
                Giao ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;

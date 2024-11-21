import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderItemProps } from "@/app/types/order_type";
import { Checkbox } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { updateOrderDetailStatus } from "@/api/orderApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import moment from "moment-timezone";
import LoadingOverlay from "@/components/LoadingOverlay";

// Hàm chuyển đổi trạng thái sang tiếng Việt và trả về màu tương ứng
const getStatusTextAndColor = (status: number) => {
  switch (status) {
    case 7:
      return { text: "Chờ giao hàng", color: "#FFA500" }; // Màu cam cho "Chờ giao hàng"
    case 8:
      return { text: "Đang giao hàng", color: "#00BFFF" }; // Màu xanh dương cho "Đang giao hàng"
    case 9:
      return { text: "Đã giao hàng", color: "#32CD32" }; // Màu xanh lá cho "Đã giao hàng"
    case 10:
      return { text: "Đã hủy", color: "#FF0000" }; // Màu đỏ cho "Đã hủy"
    default:
      return { text: "Trạng thái không xác định", color: "#000000" }; // Màu đen cho trạng thái không xác định
  }
};

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
  OrderUpload: { orderId: string };
};

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  selected,
  onSelect,
  isPending,
  onViewDetail,
  setIsDelivering,
}) => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // console.log("OrderItemNE", JSON.stringify(order));

  const router = useRouter();
  // Giới hạn địa chỉ thành 1 dòng (khoảng 40 ký tự)
  const maxLength = 40;

  // Lấy text và màu từ hàm getStatusTextAndColor
  const { text: statusText, color: statusColor } = getStatusTextAndColor(
    order.status.id
  );

  // console.log("orderlog", JSON.stringify(order));

  const handleDriverConfirm = async () => {
    console.log("Driver confirm");
    setLoading(true);
    try {
      // Gọi API và truyền orderId và trạng thái isSuccessful là true (hoặc false)
      const response = await updateOrderDetailStatus(order.orderId, true, 8);
      console.log("responseUpdatestatus", response);

      if (response.isSuccess) {
        console.log("Order status updated successfully:", response);
        if (setIsDelivering) {
          setIsDelivering(true);
        }
        showSuccessMessage("Đơn hàng này bắt đầu được giao!");
        // Hiển thị thông báo thành công và cập nhật giao diện nếu cần
      } else {
        console.error("Failed to update order status:", response.messages);
        showErrorMessage(response.messages.join("\n"));
        // Hiển thị thông báo lỗi
      }
    } catch (error) {
      showErrorMessage("Error updating order status: " + error);

      console.error("Error updating order status:", error);
      // Xử lý lỗi và hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(order.orderId);
      console.log("View detail route");
    } else {
      console.log("View detail navigation");

      navigation.navigate("OrderDetail", { orderId: order.orderId });
    }
  };

  const handleDelivered = () => {
    // console.log("orderData.orderId", orderData.orderId);

    navigation.navigate("OrderUpload", { orderId: order.orderId });
  };

  return (
    <View className=" mt-4 flex-row items-center">
      {/* Checkbox để chọn đơn */}
      <LoadingOverlay visible={loading} />

      <View
        className={`bg-[#FAFAFA] p-3 rounded-lg shadow ${
          isPending ? "w-[90%]" : "w-full"
        }`}
      >
        <View className="flex-1 ">
          {order.status.id === 7 ? (
            <Text className="text-gray-400 text-sm font-medium italic">
              {moment
                .utc(order.assignedTime)
                .local()
                .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
            </Text>
          ) : order.status.id === 8 ? (
            <Text className="text-gray-400 text-sm font-medium italic">
              {moment
                .utc(order.startDeliveringTime)
                .local()
                .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
            </Text>
          ) : order.status.id === 9 ? (
            <Text className="text-gray-400 text-sm font-medium italic">
              {moment
                .utc(order.deliveredTime)
                .local()
                .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm font-medium italic">
              {moment
                .utc(order.assignedTime)
                .local()
                .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
            </Text>
          )}

          <View className="flex-row justify-between items-center">
            <Text
              className="font-bold text-lg w-[80%] uppercase"
              style={{ color: statusColor }}
            >
              #{order.orderId.slice(0, 8)} - {statusText}
            </Text>
            <Text className="text-gray-700 font-semibold text-lg ">
              {order?.totalDuration || 0}
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
                <Text className="text-gray-600">
                  ({order?.totalDistance || 0})
                </Text>
              </View>
              <Text className="ml-2 text-gray-700 font-medium">
                {order?.account?.address || "Không xác định"}
              </Text>
            </View>
          </View>
          <View className="flex-row  justify-between">
            <TouchableOpacity
              className={`${
                order.status.id === 9 || order.status.id === 10
                  ? "w-full"
                  : "w-[45%]"
              } bg-gray-200  py-2 px-4 rounded-lg`}
              onPress={handleViewDetail}
            >
              <Text className="text-lg text-center text-gray-600 font-semibold uppercase">
                Xem
              </Text>
            </TouchableOpacity>
            {order.status.id === 7 ? (
              <TouchableOpacity className="bg-[#A1011A] w-[45%] py-2 px-4 rounded-lg">
                <Text
                  className="text-white text-lg text-center font-semibold uppercase"
                  onPress={handleDriverConfirm}
                >
                  Giao ngay
                </Text>
              </TouchableOpacity>
            ) : order.status.id === 8 ? (
              <TouchableOpacity className="bg-[#A1011A] w-[45%] py-2 px-4 rounded-lg">
                <Text
                  className="text-white text-lg text-center font-semibold uppercase"
                  onPress={handleDelivered}
                >
                  Đã giao
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;

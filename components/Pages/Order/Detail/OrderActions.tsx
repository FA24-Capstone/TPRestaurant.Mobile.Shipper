import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Order } from "@/app/types/order_type";
import CancelOrderModal from "./CancelOrderModal";
import { cancelDeliveringOrder } from "@/api/orderApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

// Define the types for navigation routes
type RootStackParamList = {
  OrderUpload: { orderId: string };
};

interface OrderActionsProps {
  orderData: Order;
  onRefetch: () => void; // Thêm prop này để gọi hàm làm mới dữ liệu
}

const OrderActions: React.FC<OrderActionsProps> = ({
  orderData,
  onRefetch,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const accountId = useSelector((state: RootState) => state.auth.account?.id);

  const handleDelivered = () => {
    // console.log("orderData.orderId", orderData.orderId);

    navigation.navigate("OrderUpload", { orderId: orderData.orderId });
  };

  const handleDelivering = () => {
    console.log("Delivering");
  };

  const handleCancelOrder = () => {
    setModalVisible(true);
  };

  const handleSubmitCancel = async (reason: string) => {
    try {
      console.log("Lý do hủy đơn:", reason);
      if (!reason) {
        showErrorMessage("Vui lòng nhập lý do hủy đơn.");
        return;
      }
      if (!accountId) {
        showErrorMessage("Không tìm thấy tài khoản người dùng.");
        return;
      }
      // Gọi API hủy đơn với lý do
      const response = await cancelDeliveringOrder(
        orderData.orderId,
        reason,
        accountId, // Thay bằng giá trị thích hợp
        false // isCancelledByAdmin có thể được điều chỉnh theo ngữ cảnh
      );

      // Gọi hàm làm mới dữ liệu khi hủy đơn thành công
      if (response.isSuccess) {
        // Xử lý phản hồi từ API nếu cần thiết
        console.log("Order cancellation response:", response);

        // Đóng modal sau khi xử lý thành công
        setModalVisible(false);
        onRefetch();
      }
    } catch (error) {
      // Đã có thông báo lỗi hiển thị thông qua showErrorMessage trong API function
      console.error("Error canceling order:", error);
    }
  };

  return (
    <View>
      <View className="flex-row justify-around">
        {orderData.statusId === 10 ? (
          <View>
            <Text className="font-bold text-lg  text-center uppercase text-red-800">
              Đơn đã bị huỷ với lý do:
            </Text>
            <Text className="font-semibold text-lg mb-4 text-center text-red-600">
              "{orderData.cancelDeliveryReason}"
            </Text>
          </View>
        ) : orderData.statusId === 9 ? (
          <Text className="font-bold text-lg mb-4 text-center uppercase text-green-500">
            Đơn đã được giao thành công
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-200 w-[45%] py-3 rounded-lg"
            onPress={handleCancelOrder} // Thay đổi ở đây
          >
            <Text className="text-center text-gray-600 font-semibold text-base uppercase">
              Hủy đơn
            </Text>
          </TouchableOpacity>
        )}
        {orderData.statusId === 7 ? (
          <TouchableOpacity
            className="bg-[#A1011A] w-[45%] py-3 rounded-lg"
            onPress={handleDelivering}
          >
            <Text className="text-center text-white font-semibold text-base uppercase">
              Giao ngay
            </Text>
          </TouchableOpacity>
        ) : (
          orderData.statusId === 8 && (
            <TouchableOpacity
              className="bg-[#A1011A] w-[45%] py-3 rounded-lg"
              onPress={handleDelivered}
            >
              <Text className="text-center text-white font-semibold text-base uppercase">
                Đã giao
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
      <CancelOrderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitCancel}
      />
    </View>
  );
};

export default OrderActions;

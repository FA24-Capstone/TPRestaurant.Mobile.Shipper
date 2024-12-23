import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Order } from "@/app/types/order_type";
import CancelOrderModal from "./CancelOrderModal";
import {
  cancelDeliveringOrder,
  updateOrderDetailStatus,
  uploadConfirmedOrderImage,
} from "@/api/orderApi";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { fetchOrdersByStatus } from "@/redux/slices/orderSlice";
import LoadingOverlay from "@/components/LoadingOverlay";

// Define the types for navigation routes
type RootStackParamList = {
  OrderUpload: { orderId: string; typeMap: string };
};

interface OrderActionsProps {
  orderData: Order;
  onRefetch: () => void; // Thêm prop này để gọi hàm làm mới dữ liệu
  typeMap: string;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  orderData,
  onRefetch,
  typeMap,
}) => {
  const dispatch = useAppDispatch();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const accountId = useSelector((state: RootState) => state.auth.account?.id);
  const [isDelivering, setIsDelivering] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleDelivered = () => {
    // console.log("orderData.orderId", orderData.orderId);

    navigation.navigate("OrderUpload", {
      orderId: orderData.orderId,
      typeMap: typeMap,
    });
  };

  const handleDelivering = async () => {
    console.log("Delivering");
    try {
      // Gọi API và truyền orderId và trạng thái isSuccessful là true (hoặc false)
      const response = await updateOrderDetailStatus(
        orderData.orderId,
        true,
        8
      );
      console.log("responseUpdatestatus", response);

      if (response.isSuccess) {
        console.log("Order status updated successfully:", response);
        if (setIsDelivering) {
          setIsDelivering(true);
        }

        onRefetch();

        showSuccessMessage("Đơn hàng này bắt đầu được giao!");

        // Dispatch thunk để refetch danh sách đơn hàng sau khi cập nhật thành công
        if (accountId) {
          const statuses = [7, 8];
          const fetchPromises = statuses.map((status) =>
            dispatch(
              fetchOrdersByStatus({
                shipperId: accountId,
                pageNumber: 1,
                pageSize: 1000,
                status,
              })
            )
          );

          // Chờ tất cả các dispatch hoàn thành
          const results = await Promise.allSettled(fetchPromises);

          // Xử lý lỗi từ các fetchOrdersByStatus
          const failedFetches = results.filter(
            (result) => result.status === "rejected"
          );

          if (failedFetches.length > 0) {
            failedFetches.forEach((failure) => {
              console.error("Fetch status failed:", failure);
              // Hiển thị thông báo lỗi từ từng dispatch thất bại
              showErrorMessage(
                failure.reason ||
                  "A system error occurred while updating statuses."
              );
            });
          }
        } else {
          showErrorMessage("Account ID is required.");
        }

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
    }
  };

  const handleCancelOrder = () => {
    setModalVisible(true);
  };

  const handleSubmitCancel = async (
    reason: string,
    refundRequired: boolean
  ) => {
    setLoading(true);
    try {
      console.log("Lý do hủy đơn:", reason);
      if (!reason) {
        showErrorMessage("Vui lòng nhập lý do hủy đơn.");
        return;
      }
      if (accountId) {
        // Gọi API upload hình ảnh với thông tin huỷ đơn
        const response = await uploadConfirmedOrderImage({
          orderId: orderData.orderId,
          isSuccessful: false, // Đánh dấu là huỷ đơn
          cancelReason: reason, // Lý do hủy
          refundRequired,
        });

        // Gọi hàm làm mới dữ liệu khi hủy đơn thành công
        if (response.isSuccess) {
          // Xử lý phản hồi từ API nếu cần thiết
          console.log("Order cancellation response:", response);

          // Đóng modal sau khi xử lý thành công
          setModalVisible(false);
          // Dispatch thunk để refetch danh sách đơn hàng sau khi cập nhật thành công
          const statuses = [7, 8, 10]; // Các status codes bạn muốn refetch
          if (accountId) {
            statuses.forEach((status) => {
              dispatch(
                fetchOrdersByStatus({
                  shipperId: accountId, // Giả sử API trả về shipperId
                  pageNumber: 1,
                  pageSize: 1000,
                  status,
                })
              );
            });
          } else {
            showErrorMessage("Account ID is required.");
          }
          onRefetch();
        } else {
          showErrorMessage(response.messages.join("\n"));
        }
      }
    } catch (error) {
      // Đã có thông báo lỗi hiển thị thông qua showErrorMessage trong API function
      console.error("Error canceling order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <LoadingOverlay visible={loading} />
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

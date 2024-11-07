import React, { useEffect, useState } from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Order } from "@/app/types/order_type";
import {
  calculateDeliverOrderFee,
  getAccountByPhoneNumber,
} from "@/api/feeShipApi";
import { AppActionResult } from "@/app/types/app_action_result_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

interface OrderSummaryProps {
  orderData: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orderData }) => {
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  // Chuẩn hóa số điện thoại để đảm bảo luôn bắt đầu bằng "0"
  const normalizePhoneNumber = (phoneNumber: string) => {
    return phoneNumber.startsWith("0") ? phoneNumber : `0${phoneNumber}`;
  };

  // Chuẩn hóa số điện thoại trước khi hiển thị hoặc gọi
  const phoneNumber = orderData?.account?.phoneNumber
    ? normalizePhoneNumber(orderData.account.phoneNumber)
    : null;

  const handleCall = () => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  //Tính phí ship
  useEffect(() => {
    if (!orderData?.account?.phoneNumber) return;
    const fetchShippingFee = async () => {
      try {
        // Lấy thông tin tài khoản để lấy customerInfoAddressId
        const accountResponse = await getAccountByPhoneNumber(
          orderData?.account?.phoneNumber
        );
        if (accountResponse.isSuccess) {
          const address = accountResponse.result.addresses.find(
            (addr) => addr.isCurrentUsed
          );

          if (address) {
            // Gọi API để tính phí ship dựa trên customerInfoAddressId
            const feeResponse: AppActionResult<number> =
              await calculateDeliverOrderFee(address.customerInfoAddressId);

            if (feeResponse.isSuccess) {
              // Cập nhật phí ship với giá trị từ feeResponse.result
              setShippingFee(feeResponse.result);
            } else {
              const feeErrorMsg =
                feeResponse.messages.join("\n") || "Không thể tính phí ship.";
              showErrorMessage(feeErrorMsg);
            }
          } else {
            showErrorMessage("Không tìm thấy địa chỉ giao hàng hiện tại.");
          }
        } else {
          const accountErrorMsg =
            accountResponse.messages.join("\n") ||
            "Không thể lấy thông tin tài khoản.";
          showErrorMessage(accountErrorMsg);
        }
      } catch (error) {
        console.error("Failed to fetch shipping fee:", error);
        showErrorMessage("Đã xảy ra lỗi khi tính phí ship. Vui lòng thử lại.");
      }
    };

    fetchShippingFee();
  }, [orderData]);

  return (
    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="text-gray-600 text-base font-medium">
          Số điện thoại
        </Text>
        <TouchableOpacity
          onPress={handleCall}
          className="flex-row items-center"
        >
          <MaterialIcons name="call" size={18} color="green" className="ml-2" />
          {orderData?.account?.phoneNumber ? (
            <Text className="text-lg text-gray-700  font-bold ml-3">
              +84 {orderData?.account?.phoneNumber}{" "}
            </Text>
          ) : (
            <Text className="text-lg text-gray-700  font-bold ml-3">
              Không có số điện thoại
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-gray-600 text-base  font-medium">Ghi chú</Text>

        <Text className="text-gray-800 font-semibold max-w-[70%] text-base">
          {orderData.note || "Không có ghi chú"}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600 text-base  font-medium">Phí ship</Text>
        <Text className="text-gray-700 font-medium text-base">
          {shippingFee !== null
            ? `${shippingFee.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}`
            : "Đang tải..."}
        </Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-red-600 font-bold text-base ">Tổng tiền</Text>
        <Text className="text-red-600 font-bold  text-base">
          {orderData.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600 text-base font-medium">Phương thức</Text>
        <Text
          className={`${
            orderData.deposit === null ? "text-yellow-600" : "text-green-600"
          } uppercase text-base font-bold`}
        >
          {orderData.deposit === null ? "Chưa thanh toán" : "Đã chuyển khoản"}
        </Text>
      </View>
    </View>
  );
};

export default OrderSummary;

import React, { useEffect, useState } from "react";
import { View, Text, Image, Linking, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Order } from "@/app/types/order_type";
import moment from "moment-timezone";
import { getOrderMap } from "@/api/orderApi";
import { ActivityIndicator } from "react-native-paper";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

interface LineDeliveryProps {
  orderData: Order;
}
const LineDelivery: React.FC<LineDeliveryProps> = ({ orderData }) => {
  const [loading, setLoading] = useState(false);
  const [startDeliveringTime, setStartDeliveringTime] = useState<Date | null>(
    null
  );
  const [deliveredTime, setDeliveredTime] = useState<Date | null>(null);

  console.log("startDeliveringTime", startDeliveringTime);

  useEffect(() => {
    if (orderData.statusId === 7) {
      const currentStartDeliveringTime = new Date(); // Lấy thời gian hiện tại
      setStartDeliveringTime(currentStartDeliveringTime);

      const calculatedDeliveredTime = moment(currentStartDeliveringTime)
        .add(durationNumber, "minutes")
        .toDate();
      setDeliveredTime(calculatedDeliveredTime);
    }
  }, [orderData.statusId]);

  const handleMapPress = async () => {
    // Kiểm tra điều kiện ban đầu
    if (!orderData || !orderData.orderId) {
      showErrorMessage("Order ID không hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      const response = await getOrderMap(orderData.orderId);

      if (response.isSuccess && response.result) {
        // Mở liên kết bản đồ nếu có kết quả
        await Linking.openURL(response.result);
        showSuccessMessage("Liên kết bản đồ đã được mở.");
      } else {
        // Hiển thị lỗi nếu không có liên kết bản đồ hoặc không thành công
        const errorMessage =
          response.messages.join("\n") || "Không thể lấy liên kết bản đồ.";
        showErrorMessage(errorMessage);
        console.error("Failed to get map link:", response.messages);
      }
    } catch (error) {
      // Hiển thị lỗi từ API hoặc lỗi không mong đợi
      showErrorMessage("Đã xảy ra lỗi khi tải liên kết bản đồ.");
      console.error("Error while fetching map link:", error);
    } finally {
      setLoading(false);
    }
  };

  const durationString = String(orderData.totalDuration || "0 phút");
  const durationMatch = durationString.match(/\d+/);
  const durationNumber = durationMatch ? parseInt(durationMatch[0], 10) : 0;
  console.log("durationNumber", durationNumber);

  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm font-medium italic">
        {moment
          .utc(orderData.assignedTime)
          .local()
          .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
      </Text>
      <View className="flex-row justify-between">
        <Text className="font-medium text-lg text-gray-700 mb-4">
          Mã đơn Order:
          <Text className="text-[#C01D2E] font-semibold">
            {" "}
            #{orderData.orderId.slice(0, 8)}
          </Text>
        </Text>
        <TouchableOpacity onPress={handleMapPress} disabled={loading}>
          <Text className="text-blue-500 text-lg italic font-medium">
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              "Xem bản đồ"
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 border-2 border-zinc-200 rounded-md">
        {orderData.statusId === 7 && startDeliveringTime ? (
          <Text className="text-gray-600 ">
            <Text className="font-semibold text-gray-800">
              {moment.utc(startDeliveringTime).local().format("hh:mm A, ")}
            </Text>
            {moment.utc(startDeliveringTime).local().format("DD/MM/YYYY")}{" "}
          </Text>
        ) : (
          <View>
            {orderData.startDeliveringTime ? (
              <Text className="text-gray-600 ">
                <Text className="font-semibold text-gray-800">
                  {moment
                    .utc(orderData.startDeliveringTime)
                    .format("hh:mm A, ")}
                </Text>
                {moment.utc(orderData.startDeliveringTime).format("DD/MM/YYYY")}{" "}
              </Text>
            ) : (
              <Text className="text-gray-500 font-semibold">
                Không xác định
              </Text>
            )}
          </View>
        )}

        <View className="flex-row mt-2 items-center  my-3">
          <Text className=" my-1 text-red-500 font-bold text-lg">
            {orderData.totalDuration || "0 phút"}
          </Text>
          <View className="ml-4">
            <Image
              source={require("../../../../assets/icon/lineplace.png")}
              style={{ width: 12, height: 109, borderRadius: 8 }}
            />
          </View>

          <View className="ml-4 w-[80%]">
            <Text className=" text-gray-400 font-semibold">
              Từ (Nhà hàng Thiên Phú)
            </Text>
            <Text className=" text-gray-700 text-base font-semibold ">
              78 Đường Lý Tự Trọng, Phường 2, Thành phố Đà Lạt, Lâm Đồng 66109
            </Text>

            <Text className=" text-gray-400 font-semibold mt-6">Đến</Text>
            <Text className=" text-gray-700 text-base font-semibold">
              {orderData?.account?.address || "Không xác định"}
            </Text>
          </View>
        </View>
        {orderData.statusId === 7 && deliveredTime ? (
          <Text className="text-gray-600 ">
            <Text className="font-semibold text-gray-800">
              {moment(deliveredTime).format("hh:mm A, ")}
            </Text>
            {moment(deliveredTime).format("DD/MM/YYYY")}{" "}
          </Text>
        ) : orderData.statusId === 8 ? (
          <Text className="text-gray-600 ">
            <Text className="font-semibold text-gray-800">
              {moment
                .utc(orderData.startDeliveringTime)
                .add(durationNumber, "minutes")
                .format("hh:mm A, ")}
            </Text>
            {moment
              .utc(orderData.startDeliveringTime)
              .add(durationNumber, "minutes")
              .format("DD/MM/YYYY")}{" "}
          </Text>
        ) : (
          <View>
            {orderData.deliveredTime ? (
              <Text className="text-gray-600 ">
                <Text className="font-semibold text-gray-800">
                  {moment
                    .utc(orderData.deliveredTime)
                    .add(durationNumber, "minutes")
                    .format("hh:mm A, ")}
                </Text>
                {moment.utc(orderData.deliveredTime).format("DD/MM/YYYY")}{" "}
              </Text>
            ) : (
              <Text className="text-gray-500 font-semibold">
                Không xác định
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default LineDelivery;

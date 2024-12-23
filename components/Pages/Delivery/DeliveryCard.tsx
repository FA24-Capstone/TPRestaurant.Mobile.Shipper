import { getOrderMap, updateOrderDetailStatus } from "@/api/orderApi";
import { DeliveryGroup } from "@/app/types/order_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";

// interface Delivery {
//   id: string;
//   point: string;
//   status: number;
//   color: string;
//   time: string;
//   address1: string;
//   address2: string;
//   distanceToNextDestination?: string;
//   startDeliveringTime?: string;
//   deliveredTime?: string;
// }

interface DeliveryCardProps {
  delivery: DeliveryGroup;
  setIsDelivering?: (isDelivering: boolean) => void;
  typeMap: string;
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string; typeMap: string };
  OrderUploadList: { orderIds: string[] };
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  setIsDelivering,
  typeMap,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [startDeliveringTime, setStartDeliveringTime] = useState<Date | null>(
    null
  );
  const [deliveredTime, setDeliveredTime] = useState<Date | null>(null);

  useEffect(() => {
    if (delivery.status === 7) {
      const currentStartDeliveringTime = new Date(); // Lấy thời gian hiện tại
      setStartDeliveringTime(currentStartDeliveringTime);

      const calculatedDeliveredTime = moment(currentStartDeliveringTime)
        .add(durationNumber, "minutes")
        .toDate();
      console.log("calculatedDeliveredTime", calculatedDeliveredTime);

      setDeliveredTime(calculatedDeliveredTime);
    }
  }, [delivery.status]);

  console.log("deliveryNHA", JSON.stringify(delivery));

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDriverConfirm = async (orderId: string) => {
    if (orderId) {
      console.log("Driver confirm for order", orderId);
      try {
        const response = await updateOrderDetailStatus(orderId, true, 8);

        if (response.isSuccess) {
          if (setIsDelivering) setIsDelivering(true);
          showSuccessMessage("Đơn hàng này bắt đầu được giao!");
        } else {
          showErrorMessage(
            `Lỗi với đơn hàng ${orderId}: ${
              response.messages || "Không xác định"
            }.`
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          showErrorMessage(
            error.message || "Đã có lỗi xảy ra khi cập nhật trạng thái."
          );
        } else {
          showErrorMessage("Đã có lỗi xảy ra khi cập nhật trạng thái.");
        }
        console.error("Error updating order status:", error);
      }
    } else {
      showErrorMessage("Không tìm thấy order ID");
    }
  };

  // Determine if the group has multiple orders
  const hasMultipleOrders = delivery.orders.length > 1;

  console.log("hasMultipleOrders", hasMultipleOrders);

  const durationString = String(delivery.time || "0 phút");
  const durationMatch = durationString.match(/\d+/);
  const durationNumber = durationMatch ? parseInt(durationMatch[0], 10) : 0;
  console.log("durationNumber", durationNumber);

  const handleMapPress = async (orderId: string) => {
    if (orderId === undefined) return;
    try {
      setLoading(true);
      const response = await getOrderMap(orderId);
      if (response.isSuccess) {
        Linking.openURL(response.result);
      } else {
        console.error("Failed to get map link:", response.messages);
      }
    } catch (error) {
      console.error("Error while fetching map link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverConfirmAll = (orderIds: string[]) => {
    if (orderIds.length === 0) {
      showErrorMessage("Không tìm thấy order ID");
      return;
    }
    console.log("Driver confirm for orders", orderIds);
    navigation.navigate("OrderUploadList", { orderIds: orderIds });
  };

  return (
    <View
      className={`mx-4 mb-4  rounded-lg shadow ${
        delivery.status === 9
          ? "bg-[#F8FFF2]"
          : delivery.status === 8
          ? "bg-[#F1F8FF]"
          : delivery.status === 7
          ? "bg-[#FFF4E0]"
          : delivery.status === 11
          ? "bg-[#ffffff] border border-gray-300"
          : "bg-[#FFF7F2]"
      }`}
    >
      <View className="flex-row p-4 justify-between">
        <Text
          className={`text-lg font-bold ${
            delivery.status === 9 ? "w-[55%]" : "w-[75%]"
          } uppercase`}
          style={{ color: delivery.color }}
        >
          {delivery.point} -{" "}
          {hasMultipleOrders
            ? `#${delivery.orders
                .map((order) => order.id.slice(0, 8))
                .join(", ")}` // If multiple orders, show all order IDs
            : `#${delivery.orders[0].id.slice(0, 8)}`}
        </Text>
        <Text
          className={`text-base  ${
            delivery.status === 9 ? "w-[45%]" : "w-[25%]"
          } text-right font-bold uppercase`}
          style={{ color: delivery.color }}
        >
          {delivery.status === 9
            ? "Đã HOÀN THÀNH"
            : delivery.status === 8
            ? "Đang giao"
            : delivery.status === 7
            ? "Chờ giao"
            : delivery.status === 11
            ? ""
            : "Đã hủy"}
        </Text>
      </View>

      <View className="flex-row p-4 mt-2 items-center  ">
        <View>
          <Text className=" my-1 text-center text-red-500 font-bold text-lg">
            {delivery.time}
          </Text>
          <Text className=" my-1 text-gray-500  text-sm">
            ({delivery.distanceToNextDestination})
          </Text>
        </View>
        <View className="ml-4">
          <Image
            source={require("../../../assets/icon/lineplace.png")}
            style={{ width: 15, height: 140, borderRadius: 8 }}
          />
        </View>

        <View className="ml-4 w-[70%]">
          {delivery.status === 7 && startDeliveringTime ? (
            <Text className="text-gray-600 italic ">
              <Text className="font-semibold italic">
                {moment(startDeliveringTime).format("hh:mm A, ")}
              </Text>
              {moment(startDeliveringTime).format("DD/MM/YYYY")}{" "}
            </Text>
          ) : (
            <View>
              {delivery.startDeliveringTime ? (
                <Text className="text-gray-600 italic">
                  <Text className="font-semibold italic">
                    {moment(delivery.startDeliveringTime).format("hh:mm A, ")}
                  </Text>
                  {moment(delivery.startDeliveringTime).format("DD/MM/YYYY")}{" "}
                </Text>
              ) : (
                <Text className="text-gray-500 font-semibold italic">
                  Không xác định
                </Text>
              )}
            </View>
          )}
          {/* <Text className=" text-gray-400 font-semibold">
            {delivery.startDeliveringTime
              ? delivery.startDeliveringTime
              : "(Hôm nay) Không xác định"}
          </Text> */}
          <Text className=" text-gray-700 mb-2 text-base font-semibold ">
            {delivery.address1}
          </Text>

          {delivery.status === 7 && deliveredTime ? (
            <Text className="text-gray-600 mt-6 italic">
              <Text className="font-semibold italic ">
                {moment(deliveredTime).format("hh:mm A, ")}
              </Text>
              {moment(deliveredTime).format("DD/MM/YYYY")}{" "}
            </Text>
          ) : delivery.status === 8 ? (
            <Text className="text-gray-600  mt-6 italic">
              <Text className="font-semibold italic">
                {moment(delivery.startDeliveringTime)
                  .add(durationNumber, "minutes")
                  .format("hh:mm A, ")}
              </Text>
              {moment(delivery.startDeliveringTime)
                .add(durationNumber, "minutes")
                .format("DD/MM/YYYY")}{" "}
            </Text>
          ) : (
            <View>
              {delivery.deliveredTime ? (
                <Text className="text-gray-600 italic mt-6">
                  <Text className="font-semibold text-gray-800">
                    {moment(delivery.deliveredTime)
                      .add(durationNumber, "minutes")
                      .format("hh:mm A, ")}
                  </Text>
                  {moment(delivery.deliveredTime).format("DD/MM/YYYY")}{" "}
                </Text>
              ) : (
                <Text className="text-gray-500 font-semibold italic mt-6">
                  Không xác định
                </Text>
              )}
            </View>
          )}

          {/* <Text className=" text-gray-400 font-semibold mt-6">
            {delivery.deliveredTime
              ? delivery.deliveredTime
              : "(Hôm nay) Không xác định"}
          </Text> */}
          <Text className=" text-gray-700 text-base font-semibold">
            {delivery.address2}
          </Text>
        </View>
      </View>
      {/* If multiple orders, show dropdown icon */}
      {hasMultipleOrders && delivery.orders[0].id ? (
        <View className="p-4">
          <View className="flex-row justify-between">
            {delivery.status === 8 && delivery.orders[0].id && (
              <TouchableOpacity
                className={` mt-2 w-[45%] bg-[#A1011A] py-2 rounded-lg`}
                onPress={() =>
                  handleDriverConfirmAll(
                    delivery.orders.map((order) => order.id)
                  )
                }
              >
                <Text className="text-white text-center font-semibold text-base">
                  Đã giao
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`${
                delivery.status === 8 ? "w-[45%]" : "w-full"
              } mt-2  bg-blue-400 py-2 rounded-lg`}
              onPress={() => handleMapPress(delivery.orders[0].id)}
            >
              <Text className="text-white text-center font-semibold text-base">
                Xem bản đồ
              </Text>
            </TouchableOpacity>
          </View>

          {/* Toggle between chevron-down and chevron-up based on `isDropdownOpen` */}
          <TouchableOpacity onPress={toggleDropdown} className="mt-3 mx-auto">
            <MaterialCommunityIcons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} // Toggle icon
              size={26}
              color={"gray"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row p-4 justify-between">
          {delivery.orders[0].id && (
            <TouchableOpacity
              className={` mt-2 w-[48%] ${
                delivery.status === 9
                  ? "bg-[#086634]/5"
                  : delivery.status === 8
                  ? "bg-[#084466]/5"
                  : delivery.status === 7
                  ? "bg-[#341F00]/5"
                  : delivery.status === 11
                  ? "#ffffff"
                  : "bg-[#4D0000]/5"
              } py-2 rounded-lg`}
              onPress={() =>
                router.push(`/order-detail?id=${delivery.orders[0].id}`)
              }
            >
              <Text
                className="text-gray-600 text-center font-semibold text-base"
                onPress={() =>
                  navigation.navigate("OrderDetail", {
                    orderId: delivery.orders[0].id,
                    typeMap: typeMap,
                  })
                }
              >
                Xem
              </Text>
            </TouchableOpacity>
          )}
          {delivery.status === 7 && delivery.orders[0].id ? (
            <TouchableOpacity
              className={` mt-2 w-[48%] bg-[#A1011A] py-2 rounded-lg`}
              onPress={() => handleDriverConfirm(delivery.orders[0].id)}
            >
              <Text className="text-white text-center uppercase font-semibold text-base">
                Giao Ngay
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={` mt-2 w-[48%] bg-blue-400 py-2 rounded-lg`}
              onPress={() => handleMapPress(delivery.orders[0].id)}
            >
              <Text className="text-white text-center font-semibold text-base">
                Xem bản đồ
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* If the group has only one order or the dropdown is expanded */}

      {/* If dropdown is expanded and multiple orders */}
      {isDropdownOpen &&
        hasMultipleOrders &&
        delivery.orders.map((order) => {
          console.log("====================================");
          console.log(order);
          console.log("====================================");
          return (
            <View
              key={order.id}
              className={`mb-2 mt-4 p-4 ${
                order.status === 9
                  ? "bg-[#F8FFF2]"
                  : order.status === 8
                  ? "bg-[#F1F8FF]"
                  : order.status === 7
                  ? "bg-[#FFF4E0]"
                  : "bg-[#FFF7F2]"
              }`}
            >
              <Text className="text-gray-400 text-sm font-medium italic">
                {moment(order.assignedTime)
                  .local()
                  .format("hh:mm A, DD/MM/YYYY") || "Không xác định"}
              </Text>
              <View className="flex-row justify-between">
                <Text
                  className="text-lg font-bold uppercase"
                  style={{ color: delivery.color }}
                >
                  Order ID: #{order.id.slice(0, 8)}
                </Text>
                <Text
                  className={`text-base ${
                    order.status === 9
                      ? "text-[#4F970F]"
                      : order.status === 8
                      ? "text-[#1D72C0]"
                      : order.status === 7
                      ? "text-[#E3B054]"
                      : "text-[#ff3f3f]"
                  } text-right font-bold uppercase`}
                >
                  {order.status === 9
                    ? "Đã HOÀN THÀNH"
                    : order.status === 8
                    ? "Đang giao"
                    : order.status === 7
                    ? "Chờ giao"
                    : "Đã hủy"}
                </Text>
              </View>

              <Text className="text-gray-700 text-sm font-semibold">
                Địa chỉ: {order.order.account.address}
              </Text>

              {/* Two buttons for each order */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  className={` mt-2 w-full ${
                    order.status === 9
                      ? "bg-[#086634]/5"
                      : order.status === 8
                      ? "bg-[#084466]/5"
                      : order.status === 7
                      ? "bg-[#341F00]/5"
                      : "bg-[#4D0000]/5"
                  } py-2 rounded-lg`}
                  onPress={() =>
                    navigation.navigate("OrderDetail", {
                      orderId: order.id,
                      typeMap: typeMap,
                    })
                  }
                >
                  <Text className="text-gray-600 text-center font-semibold text-base">
                    Xem
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default DeliveryCard;

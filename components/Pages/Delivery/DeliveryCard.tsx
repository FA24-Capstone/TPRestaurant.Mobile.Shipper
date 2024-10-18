import { DeliveryGroup } from "@/app/types/order_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

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
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  console.log("deliveryNHA", JSON.stringify(delivery));

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDriverConfirm = (orderId: string) => {
    console.log("Driver confirm for order", orderId);
  };

  // Determine if the group has multiple orders
  const hasMultipleOrders = delivery.orders.length;

  console.log("hasMultipleOrders", hasMultipleOrders);

  return (
    <View
      className={`mx-4 mb-4 p-4 rounded-lg shadow ${
        delivery.status === 9
          ? "bg-[#F8FFF2]"
          : delivery.status === 8
          ? "bg-[#F1F8FF]"
          : delivery.status === 7
          ? "bg-[#FFF4E0]"
          : "bg-[#FFF7F2]"
      }`}
    >
      <View className="flex-row justify-between">
        <Text
          className="text-lg font-bold uppercase"
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
          className={`text-base font-bold uppercase`}
          style={{ color: delivery.color }}
        >
          {delivery.status === 9
            ? "Đã HOÀN THÀNH"
            : delivery.status === 8
            ? "Đang giao"
            : delivery.status === 7
            ? "Chờ giao"
            : "Đã hủy"}
        </Text>
      </View>

      <View className="flex-row mt-2 items-center  ">
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
          <Text className=" text-gray-400 font-semibold">
            {delivery.startDeliveringTime
              ? delivery.startDeliveringTime
              : "(Hôm nay) Không xác định"}
          </Text>
          <Text className=" text-gray-700 text-base font-semibold ">
            {delivery.address1}
          </Text>

          <Text className=" text-gray-400 font-semibold mt-6">
            {delivery.deliveredTime
              ? delivery.deliveredTime
              : "(Hôm nay) Không xác định"}
          </Text>
          <Text className=" text-gray-700 text-base font-semibold">
            {delivery.address2}
          </Text>
        </View>
      </View>
      {/* If multiple orders, show dropdown icon */}
      {hasMultipleOrders ? (
        <>
          <TouchableOpacity
            className={`w-full bg-[#A1011A] py-2 rounded-lg mt-2`}
            onPress={
              () =>
                delivery.orders.forEach((order) =>
                  handleDriverConfirm(order.id)
                ) // Loop through all orders and confirm them
            }
          >
            <Text className="text-white text-center uppercase font-semibold text-base">
              Giao Ngay
            </Text>
          </TouchableOpacity>

          {/* Toggle between chevron-down and chevron-up based on `isDropdownOpen` */}
          <TouchableOpacity onPress={toggleDropdown} className="mt-3 mx-auto">
            <MaterialCommunityIcons
              name={isDropdownOpen ? "chevron-down" : "chevron-up"} // Toggle icon
              size={26}
              color={"gray"}
            />
          </TouchableOpacity>
        </>
      ) : (
        <View className="flex-row justify-between">
          <TouchableOpacity
            className={` mt-2 w-[48%] ${
              delivery.status === 9
                ? "bg-[#086634]/5"
                : delivery.status === 8
                ? "bg-[#084466]/5"
                : delivery.status === 7
                ? "bg-[#341F00]/5"
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
                })
              }
            >
              Xem
            </Text>
          </TouchableOpacity>
          {delivery.status === 7 ? (
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
        delivery.orders.map((order) => (
          <View key={order.id} className="mb-2 mt-4">
            <Text
              className="text-lg font-bold uppercase"
              style={{ color: delivery.color }}
            >
              Order ID: #{order.id.slice(0, 8)}
            </Text>
            <Text className="text-gray-700">
              Địa chỉ: {order.order.account.address}
            </Text>

            {/* Two buttons for each order */}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className={` mt-2 w-full ${
                  delivery.status === 9
                    ? "bg-[#086634]/5"
                    : delivery.status === 8
                    ? "bg-[#084466]/5"
                    : delivery.status === 7
                    ? "bg-[#341F00]/5"
                    : "bg-[#4D0000]/5"
                } py-2 rounded-lg`}
                onPress={() =>
                  navigation.navigate("OrderDetail", { orderId: order.id })
                }
              >
                <Text className="text-gray-600 text-center font-semibold text-base">
                  Xem
                </Text>
              </TouchableOpacity>

              {order.status !== 7 && (
                <TouchableOpacity
                  className={`w-[48%] bg-blue-400 py-2 rounded-lg`}
                >
                  <Text className="text-white text-center font-semibold text-base">
                    Xem bản đồ
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
    </View>
  );
};

export default DeliveryCard;

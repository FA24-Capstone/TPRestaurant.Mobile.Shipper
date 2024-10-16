import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface Delivery {
  id: string;
  point: string;
  status: number;
  color: string;
  time: string;
  address1: string;
  address2: string;
  distanceToNextDestination?: string;
  startDeliveringTime?: string;
  deliveredTime?: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  console.log("deliveryNHA", JSON.stringify(delivery));

  const handleDriverConfirm = () => {
    console.log("Driver confirm");
  };

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
          {delivery.point} - #{delivery.id.slice(0, 8)}
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
          onPress={() => router.push(`/order-detail?id=${delivery.id}`)}
        >
          <Text
            className="text-gray-600 text-center font-semibold text-base"
            onPress={() =>
              navigation.navigate("OrderDetail", { orderId: delivery.id })
            }
          >
            Xem
          </Text>
        </TouchableOpacity>
        {delivery.status === 7 ? (
          <TouchableOpacity
            className={` mt-2 w-[48%] bg-[#A1011A] py-2 rounded-lg`}
            onPress={handleDriverConfirm}
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
    </View>
  );
};

export default DeliveryCard;

import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface Delivery {
  id: string;
  point: string;
  orderNumber: string;
  status: string;
  isCompleted: boolean;
  color: string;
  time: string;
  address1: string;
  address2: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: undefined;
};

const DeliveryCard: React.FC<DeliveryCardProps> = ({ delivery }) => {
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View
      className={`mx-4 mb-4 p-4 rounded-lg shadow ${
        delivery.status === "delivered"
          ? "bg-[#F8FFF2]"
          : delivery.status === "delivering"
          ? "bg-[#F1F8FF]"
          : "bg-[#FFF4E0]"
      }`}
    >
      <View className="flex-row justify-between">
        <Text className="text-lg font-bold" style={{ color: delivery.color }}>
          {delivery.point} - ĐƠN {delivery.id}
        </Text>
        <Text
          className={`text-base font-bold uppercase`}
          style={{ color: delivery.color }}
        >
          {delivery.status === "delivered"
            ? "Đã HOÀN THÀNH"
            : delivery.status === "delivering"
            ? "Đang giao"
            : "Chờ giao"}
        </Text>
      </View>
      <View className="flex-row mt-2 items-center  ">
        <Text className=" my-1 text-red-500 font-bold text-lg">
          {delivery.time}
        </Text>
        <View className="ml-4">
          <Image
            source={require("../../../assets/icon/lineplace.png")}
            style={{ width: 15, height: 140, borderRadius: 8 }}
          />
        </View>

        <View className="ml-4 w-[80%]">
          <Text className=" text-gray-400 font-semibold">
            11:20 AM,27/09/2024 (Hôm nay)
          </Text>
          <Text className=" text-gray-700 text-base font-semibold ">
            {delivery.address1}
          </Text>

          <Text className=" text-gray-400 font-semibold mt-6">
            11:20 AM,27/09/2024 (Hôm nay)
          </Text>
          <Text className=" text-gray-700 text-base font-semibold">
            {delivery.address2}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <TouchableOpacity
          className={` mt-2 w-[48%] ${
            delivery.status === "delivered"
              ? "bg-[#086634]/5"
              : delivery.status === "delivering"
              ? "bg-[#084466]/5"
              : "bg-[#341F00]/5"
          } py-2 rounded-lg`}
          onPress={() => router.push(`/order-detail?id=${delivery.id}`)}
        >
          <Text
            className="text-gray-600 text-center font-semibold text-base"
            onPress={() => navigation.navigate("OrderDetail")}
          >
            Xem
          </Text>
        </TouchableOpacity>
        {delivery.status === "pending" ? (
          <TouchableOpacity
            className={` mt-2 w-[48%] bg-[#A1011A] py-2 rounded-lg`}
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

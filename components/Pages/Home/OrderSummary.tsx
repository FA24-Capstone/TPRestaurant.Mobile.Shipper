import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface OrderSummaryProps {
  completedOrders: number;
  pendingOrders: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  completedOrders,
  pendingOrders,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-around mt-4">
      <TouchableOpacity
        className="bg-[#EDAA16]/20 p-4 rounded-lg w-[45%]"
        onPress={() => {
          router.push("/order-list");
        }}
      >
        <Text className="text-[#EDAA16]  font-semibold text-center mb-2">
          Đơn chưa hoàn thành
        </Text>
        <Text className="text-[#EDAA16]  text-center font-bold text-3xl">
          {pendingOrders} ĐƠN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/order-list");
        }}
        className="bg-[#E8F5E9] p-4 rounded-lg w-[45%]"
      >
        <Text className="text-[#388E3C] font-semibold text-center mb-2">
          Đơn đã hoàn thành
        </Text>
        <Text className="text-[#388E3C] font-bold text-3xl  text-center">
          {completedOrders} ĐƠN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSummary;

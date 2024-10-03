import React from "react";
import { View, Text } from "react-native";

interface OrderSummaryProps {
  completedOrders: number;
  pendingOrders: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  completedOrders,
  pendingOrders,
}) => {
  return (
    <View className="flex-row justify-around mt-4">
      <View className="bg-[#E8F5E9] p-4 rounded-lg w-[45%]">
        <Text className="text-[#388E3C] font-semibold text-center mb-2">
          Đơn đã hoàn thành
        </Text>
        <Text className="text-[#388E3C] font-bold text-3xl  text-center">
          {completedOrders} ĐƠN
        </Text>
      </View>
      <View className="bg-[#FFEBEE] p-4 rounded-lg w-[45%]">
        <Text className="text-[#D32F2F]  font-semibold text-center mb-2">
          Đơn chưa hoàn thành
        </Text>
        <Text className="text-[#D32F2F]  text-center font-bold text-3xl">
          {pendingOrders} ĐƠN
        </Text>
      </View>
    </View>
  );
};

export default OrderSummary;

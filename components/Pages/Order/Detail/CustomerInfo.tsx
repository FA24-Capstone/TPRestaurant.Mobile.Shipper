import { Account, Order } from "@/app/types/order_type";
import React from "react";
import { View, Text } from "react-native";
import { Avatar, Badge } from "react-native-paper";

interface CustomerInfoProps {
  customerData: Order;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customerData }) => {
  console.log("customerData", customerData);

  return (
    <View className="flex-row items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
      <View className="flex-row items-center">
        <Avatar.Text
          size={60}
          label={`${customerData?.account?.firstName?.slice(0, 1) || ""}${
            customerData?.account?.lastName?.slice(0, 1) || ""
          }`} // Sử dụng ký tự đầu của tên và họ
        />
        <View className="ml-4">
          <Text className="text-xl font-bold">
            {customerData?.account?.lastName} {customerData?.account?.firstName}
          </Text>
          <Text className="text-gray-500 text-base">Khách quen</Text>
        </View>
      </View>
      <View>
        <Text className="text-[#A1011A] font-semibold text-center text-lg mb-2">
          {customerData?.account?.distance || "5km"}
        </Text>
        <View className="bg-blue-500 p-2 rounded-md">
          <Text className="text-center text-white font-semibold">
            {customerData?.status?.vietnameseName || customerData?.statusId}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomerInfo;

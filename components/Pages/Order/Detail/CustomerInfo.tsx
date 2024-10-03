import React from "react";
import { View, Text } from "react-native";
import { Avatar, Badge } from "react-native-paper";

const CustomerInfo: React.FC = () => {
  return (
    <View className="flex-row items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
      <View className="flex-row items-center">
        <Avatar.Text size={60} label="BP" />
        <View className="ml-4">
          <Text className="text-xl font-bold">Bích Phương</Text>
          <Text className="text-gray-500 text-base">Khách quen</Text>
        </View>
      </View>
      <View>
        <Text className="text-[#A1011A] font-semibold text-center text-lg mb-2">
          5km
        </Text>
        <View className="bg-blue-500 p-2 rounded-md">
          <Text className="text-center text-white font-semibold">
            Đang giao
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomerInfo;

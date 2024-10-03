import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const OrderActions: React.FC = () => {
  return (
    <View className="flex-row justify-around">
      <TouchableOpacity className="bg-gray-200 w-[45%] py-3 rounded-lg">
        <Text className="text-center text-gray-600 font-semibold text-base uppercase">
          Hủy đơn
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#A1011A] w-[45%] py-3 rounded-lg">
        <Text className="text-center text-white font-semibold text-base uppercase">
          Đã giao
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderActions;

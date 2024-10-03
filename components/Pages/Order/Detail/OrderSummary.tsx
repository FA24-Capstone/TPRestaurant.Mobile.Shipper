import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const OrderSummary: React.FC = () => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="text-gray-600 text-base font-medium">
          Số điện thoại
        </Text>
        <View className="flex-row items-center">
          <MaterialIcons name="call" size={18} color="green" className="ml-2" />
          <Text className="text-lg text-gray-700  font-bold ml-3">
            0912 345 678
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-gray-600 text-base  font-medium">Ghi chú</Text>

        <Text className="text-gray-800 font-semibold text-base">
          Ít cay, ship sớm
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600 text-base  font-medium">Phí ship</Text>
        <Text className="text-gray-700 font-medium text-base">30.000 VND</Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-red-600 font-bold text-base font-medium">
          Tổng tiền
        </Text>
        <Text className="text-red-600 font-bold  text-base">350.000 VND</Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600 text-base font-medium">Phương thức</Text>
        <Text className="text-green-600 uppercase text-base font-semibold">
          Đã chuyển khoản
        </Text>
      </View>
    </View>
  );
};

export default OrderSummary;

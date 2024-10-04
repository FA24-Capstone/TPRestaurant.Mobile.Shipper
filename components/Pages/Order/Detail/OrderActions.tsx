import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Define the types for navigation routes
type RootStackParamList = {
  OrderUpload: undefined;
};

const OrderActions: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleDelivered = () => {
    navigation.navigate("OrderUpload");
  };
  return (
    <View className="flex-row justify-around">
      <TouchableOpacity className="bg-gray-200 w-[45%] py-3 rounded-lg">
        <Text className="text-center text-gray-600 font-semibold text-base uppercase">
          Hủy đơn
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[#A1011A] w-[45%] py-3 rounded-lg"
        onPress={handleDelivered}
      >
        <Text className="text-center text-white font-semibold text-base uppercase">
          Đã giao
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderActions;

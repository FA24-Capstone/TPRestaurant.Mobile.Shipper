import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Order } from "@/app/types/order_type";

// Define the types for navigation routes
type RootStackParamList = {
  OrderUpload: { orderId: string };
};

interface OrderActionsProps {
  orderData: Order;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderData }) => {
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleDelivered = () => {
    // console.log("orderData.orderId", orderData.orderId);

    navigation.navigate("OrderUpload", { orderId: orderData.orderId });
  };

  const handleDelivering = () => {
    console.log("Delivering");
  };

  return (
    <View className="flex-row justify-around">
      <TouchableOpacity className="bg-gray-200 w-[45%] py-3 rounded-lg">
        <Text className="text-center text-gray-600 font-semibold text-base uppercase">
          Hủy đơn
        </Text>
      </TouchableOpacity>
      {orderData.statusId === 7 ? (
        <TouchableOpacity
          className="bg-[#A1011A] w-[45%] py-3 rounded-lg"
          onPress={handleDelivering}
        >
          <Text className="text-center text-white font-semibold text-base uppercase">
            Giao ngay
          </Text>
        </TouchableOpacity>
      ) : (
        orderData.statusId === 8 && (
          <TouchableOpacity
            className="bg-[#A1011A] w-[45%] py-3 rounded-lg"
            onPress={handleDelivered}
          >
            <Text className="text-center text-white font-semibold text-base uppercase">
              Đã giao
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default OrderActions;

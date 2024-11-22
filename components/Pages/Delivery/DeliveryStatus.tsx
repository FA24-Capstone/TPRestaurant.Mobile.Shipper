import { DeliveryGroup } from "@/app/types/order_type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

// interface Delivery {
//   id: string;
//   color: string;
//   point: string;
//   status: number;
// }

interface DeliveryStatusProps {
  deliveries: DeliveryGroup[];
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
};

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ deliveries }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false} // Hide the scroll indicator for a cleaner look
      contentContainerStyle={{
        alignItems: "center",
        paddingLeft: 16, // Add padding to prevent content from being cut off
        paddingRight: 16, // Optional: Padding on the right for better spacing
      }}
    >
      <View className="flex-row my-3 items-center ">
        {deliveries.map((delivery, index) => (
          <TouchableOpacity
            key={delivery.orders[0].id}
            className="flex-row items-center shadow-md"
            onPress={() =>
              navigation.navigate("OrderDetail", {
                orderId: delivery.orders[0].id,
              })
            }
          >
            <View
              className={`py-2 px-6 mx-1 rounded-lg ${
                delivery.status === 9
                  ? "bg-[#4F970F]"
                  : delivery.status === 8
                  ? "bg-[#1D72C0]"
                  : delivery.status === 7
                  ? "bg-[#E3B054]"
                  : "bg-gray-400"
              }`}
            >
              <Text className="text-white uppercase font-bold text-lg text-center">
                {delivery.point}
              </Text>

              <Text className="text-white uppercase  font-bold text-lg text-center">
                #{delivery.orders.map((id) => id.id.slice(0, 8)).join(", ")}
              </Text>
            </View>

            {/* Conditionally render ">" except after the last item */}
            {index < deliveries.length - 1 && (
              <Text className="font-semibold text-gray-400 text-2xl mx-4">
                {">"}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default DeliveryStatus;

import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface Delivery {
  id: string;
  color: string;
  point: string;
  orderNumber: string;
  status: string;
}

interface DeliveryStatusProps {
  deliveries: Delivery[];
}

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: undefined;
};

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({ deliveries }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false} // Hide the scroll indicator for a cleaner look
      contentContainerStyle={{ alignItems: "center", margin: "auto" }} // Align items vertically in the center
    >
      <View className="flex-row my-3 items-center ">
        {deliveries.map((delivery, index) => (
          <TouchableOpacity
            key={delivery.id}
            className="flex-row items-center shadow-md"
            onPress={() => navigation.navigate("OrderDetail")}
          >
            <View
              className={`py-2 px-6 mx-1 rounded-lg ${
                delivery.status === "delivered"
                  ? "bg-[#4F970F]"
                  : delivery.status === "delivering"
                  ? "bg-[#1D72C0]"
                  : "bg-[#E3B054]"
              }`}
            >
              <Text className="text-white font-bold text-lg text-center">
                {delivery.point}
              </Text>

              <Text className="text-white font-bold text-lg text-center">
                {delivery.id}
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
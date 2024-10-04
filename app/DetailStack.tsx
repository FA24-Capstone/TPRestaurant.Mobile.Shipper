import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";
import OrderDetail from "./(tabs)/order-detail";
import OptimizeDelivery from "./(tabs)/optimize-delivery";

const Stack = createNativeStackNavigator();

const DetailStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="order-detail"
        component={OrderDetail}
        options={{
          header: () => <CustomHeaderDetail title="Chi tiết đơn hàng" />,
        }}
      />
      <Stack.Screen
        name="optimize-delivery"
        component={OptimizeDelivery}
        options={{
          header: () => <CustomHeaderDetail title="Tối ưu chặng đường" />,
        }}
      />
    </Stack.Navigator>
  );
};

export default DetailStack;

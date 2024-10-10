// src/components/Pages/Order/ScrollViewTabs.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import OrderList from "@/components/Pages/Order/OrderList";
import { Order } from "@/app/types/order_type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
  OptimizeDelivery: undefined;
};

interface ScrollViewTabsProps {
  ordersByStatus: {
    pending: Order[];
    delivering: Order[];
    delivered: Order[];
    cancelled: Order[];
  };
  selectedOrders: string[];
  handleSelectOrder: (orderId: string) => void;
}

const ScrollViewTabs: React.FC<ScrollViewTabsProps> = ({
  ordersByStatus,
  selectedOrders,
  handleSelectOrder,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedStatus, setSelectedStatus] =
    useState<keyof typeof ordersByStatus>("pending");

  const filteredOrders = ordersByStatus[selectedStatus];

  const getTitle = (status: keyof typeof ordersByStatus) => {
    switch (status) {
      case "pending":
        return "Danh sách đơn cần giao";
      case "delivering":
        return "Danh sách đơn đang giao";
      case "delivered":
        return "Danh sách đơn đã giao";
      case "cancelled":
        return "Danh sách đơn đã hủy";
      default:
        return "Danh sách đơn hàng";
    }
  };

  const handleViewDetail = (orderId: string) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  return (
    <>
      {/* Tabs with ScrollView */}
      <View className="flex-row mx-4 my-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-4">
            {Object.keys(ordersByStatus).map((statusKey) => (
              <TouchableOpacity
                key={statusKey}
                className={`py-2 px-4 rounded-lg ${
                  selectedStatus === statusKey ? "bg-[#A1011A]" : "bg-gray-200"
                }`}
                onPress={() =>
                  setSelectedStatus(statusKey as keyof typeof ordersByStatus)
                }
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    selectedStatus === statusKey
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {getTitle(statusKey as keyof typeof ordersByStatus)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Dynamic title based on status */}
      <Text className="font-semibold uppercase text-xl mt-2 mx-4">
        {getTitle(selectedStatus)}
      </Text>

      {/* Order list */}
      <OrderList
        orders={filteredOrders}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={selectedStatus === "pending"}
        onViewDetail={handleViewDetail}
      />

      {/* Show optimization button if two or more orders are selected */}
      {selectedOrders.length >= 2 && (
        <TouchableOpacity
          className="bg-white border-[#A1011A] border-2 py-3 mx-4 rounded-lg my-4"
          onPress={() => navigation.navigate("OptimizeDelivery")}
        >
          <Text className="text-[#A1011A] text-center font-semibold text-lg">
            Tối ưu chặng đường
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ScrollViewTabs;

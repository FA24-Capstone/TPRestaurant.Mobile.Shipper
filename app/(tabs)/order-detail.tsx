import CustomerInfo from "@/components/Pages/Order/Detail/CustomerInfo";
import LineDelivery from "@/components/Pages/Order/Detail/LineDelivery";
import OrderActions from "@/components/Pages/Order/Detail/OrderActions";
import OrderDishes from "@/components/Pages/Order/Detail/OrderItems";
import OrderSummary from "@/components/Pages/Order/Detail/OrderSummary";
import React from "react";
import { ScrollView, View } from "react-native";

const OrderDetail = () => {
  return (
    <View className="flex-1 bg-white">
      {/* Scrollable content */}
      <ScrollView className="flex-1 p-4 mb-20">
        {/* Adjusted margin to avoid overlapping with bottom button */}
        {/* Thông tin khách hàng */}
        <CustomerInfo />
        {/* Trạng thái đơn hàng và địa chỉ */}
        <LineDelivery />
        {/* Tóm tắt đơn hàng */}
        <OrderSummary />
        {/* Horizontal line (divider) */}
        <View className="border-b border-gray-300 my-4" />
        {/* Danh sách món ăn */}
        <OrderDishes />
      </ScrollView>

      {/* Order actions placed at the bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4">
        <OrderActions />
      </View>
    </View>
  );
};

export default OrderDetail;

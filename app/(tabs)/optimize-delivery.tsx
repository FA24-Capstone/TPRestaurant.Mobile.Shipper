import DeliveryCard from "@/components/Pages/Delivery/DeliveryCard";
import DeliveryStatus from "@/components/Pages/Delivery/DeliveryStatus";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

const OptimizeDelivery: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Ẩn thanh tab khi màn hình này được mount
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    // Hiển thị lại thanh tab khi màn hình này được unmount
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);
  const deliveries = [
    {
      id: "#351",
      point: "A",
      status: "delivered",
      color: "#4F970F",
      orderNumber: "#351",
      address1: "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109",
      address2: "S6.06 Vinhomes Grand Park, TP Thủ Đức, TP Hồ Chí Minh",
      time: "20p",
      isCompleted: true,
    },
    {
      id: "#352",
      point: "B",
      status: "delivering",
      color: "#1D72C0",
      orderNumber: "#351",
      address1: "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109",
      address2: "S6.06 Vinhomes Grand Park, TP Thủ Đức, TP Hồ Chí Minh",
      time: "20p",
      isCompleted: false,
    },
    {
      id: "#353",
      point: "C",
      status: "pending",
      color: "#E3B054",
      orderNumber: "#351",
      address1: "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109",
      address2: "S6.06 Vinhomes Grand Park, TP Thủ Đức, TP Hồ Chí Minh",
      time: "20p",
      isCompleted: false,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Delivery Status */}
      <View className="flex-row justify-center my-2">
        <DeliveryStatus deliveries={deliveries} />
      </View>

      {/* Delivery Cards */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {deliveries.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))}
      </ScrollView>
    </View>
  );
};

export default OptimizeDelivery;

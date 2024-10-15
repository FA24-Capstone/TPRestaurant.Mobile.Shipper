import DeliveryCard from "@/components/Pages/Delivery/DeliveryCard";
import DeliveryStatus from "@/components/Pages/Delivery/DeliveryStatus";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { GetOptimalPathRequest, OptimalPathResult } from "../types/order_type";
import { getOptimalPath } from "@/api/orderApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

interface RouteParams {
  selectedOrders: string[];
}

interface Delivery {
  id: string;
  point: string;
  status: number;
  color: string;
  address1: string;
  address2: string;
  time: string;
  distanceToNextDestination?: string;
}

const OptimizeDelivery: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedOrders } = route.params as RouteParams;

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("selectedOrdersNew", JSON.stringify(selectedOrders));

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

  useEffect(() => {
    const fetchOptimalPath = async () => {
      try {
        const requestBody: GetOptimalPathRequest = selectedOrders;
        const response = await getOptimalPath(requestBody);

        if (response.isSuccess) {
          // Biến tạm để giữ giá trị address2 của phần tử trước đó
          let previousAddress2 =
            "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109";

          const mappedDeliveries: Delivery[] = response.result.map(
            (item: OptimalPathResult, index: number) => {
              // address1 là previousAddress2, và address2 là địa chỉ của order hiện tại
              const address1 =
                index === 0
                  ? "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109"
                  : previousAddress2;
              const address2 = item.order.account.address;

              // Cập nhật previousAddress2 cho lần lặp tiếp theo
              previousAddress2 = address2;

              // Chuyển đổi thời gian từ giây sang phút và làm tròn đến số nguyên
              const durationInMinutes = Math.round(item.duration / 60);
              const distanceInKm = Math.round(
                item.distanceToNextDestination / 1000
              );

              return {
                id: item.order.orderId,
                point: String.fromCharCode(65 + (item.index - 1)),
                status: item.order.statusId,
                color:
                  item.order.statusId === 7
                    ? "#E3B054"
                    : item.order.statusId === 8
                    ? "#1D72C0"
                    : item.order.statusId === 9
                    ? "#4F970F"
                    : "#9A0E1D",
                address1: address1,
                address2: address2,
                time: `${durationInMinutes}p`,
                distanceToNextDestination: `${distanceInKm}km`,
              };
            }
          );

          setDeliveries(mappedDeliveries);
        } else {
          setError("Failed to retrieve optimal path.");
          showErrorMessage("Failed to retrieve optimal path.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        showErrorMessage("An error occurred while fetching data.");
        console.error("Failed to get optimal path:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimalPath();
  }, [selectedOrders]);

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

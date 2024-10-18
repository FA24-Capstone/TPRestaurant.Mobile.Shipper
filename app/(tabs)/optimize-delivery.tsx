import DeliveryCard from "@/components/Pages/Delivery/DeliveryCard";
import DeliveryStatus from "@/components/Pages/Delivery/DeliveryStatus";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import {
  Delivery,
  DeliveryGroup,
  GetOptimalPathRequest,
  OptimalPathResult,
  Order,
} from "../types/order_type";
import { getOptimalPath } from "@/api/orderApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";

interface RouteParams {
  selectedOrders: string[];
}

// interface Delivery {
//   id: string;
//   point: string;
//   status: number;
//   color: string;
//   address1: string;
//   address2: string;
//   time: string;
//   distanceToNextDestination?: string;
//   startDeliveringTime?: string;
//   deliveredTime?: string;
// }

const OptimizeDelivery: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedOrders } = route.params as RouteParams;

  const [deliveries, setDeliveries] = useState<DeliveryGroup[]>([]);
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
          // Temporary variable to hold the previous address
          let previousAddress2 =
            "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109";

          const mappedDeliveries: Delivery[] = [];

          // Iterate through each OptimalPathResult item
          response.result.forEach((item: OptimalPathResult) => {
            // Determine the point based on the item's index
            const pointLetter = String.fromCharCode(65 + (item.index - 1));

            // Iterate through each order in the current item
            item.orders.forEach((order: Order) => {
              const address1 = previousAddress2;
              const address2 = order.account.address;

              // Create a Delivery object for the current order
              const delivery: Delivery = {
                id: order.orderId,
                status: order.statusId,
                color:
                  order.statusId === 7
                    ? "#E3B054" // AssignedToShipper
                    : order.statusId === 8
                    ? "#1D72C0" // Some other status
                    : order.statusId === 9
                    ? "#4F970F" // Another status
                    : "#9A0E1D", // Default/Error status
                time: item.duration,
                distanceToNextDestination: item.distanceFromPreviousDestination,
                startDeliveringTime: order.startDeliveringTime,
                deliveredTime: order.deliveredTime,
                order: order,
                address1: address1, // Always the starting point
                address2: address2, // Could be the same or different from address1
              };

              // Add the Delivery object to the array
              mappedDeliveries.push(delivery);
            });

            // Update the previousAddress2 to the last address in the current item
            if (item.orders.length > 0) {
              previousAddress2 =
                item.orders[item.orders.length - 1].account.address;
            }
          });

          console.log("Mapped deliveries", mappedDeliveries);

          // Group deliveries by address only (no longer grouping by orderId)
          const groupedDeliveriesMap = new Map<string, DeliveryGroup>();

          mappedDeliveries.forEach((delivery) => {
            const key = delivery.order.account.address || ""; // Group by address only

            if (!groupedDeliveriesMap.has(key)) {
              groupedDeliveriesMap.set(key, {
                point: String.fromCharCode(
                  65 +
                    (response.result.find((r) =>
                      r.orders.some((o) => o.orderId === delivery.id)
                    )?.index || 0) -
                    1
                ),
                status: delivery.status,
                color: delivery.color,
                address1: delivery.address1, // Keep the starting point constant
                address2: delivery.address2, // Can vary based on the order
                time: delivery.time,
                distanceToNextDestination: delivery.distanceToNextDestination,
                startDeliveringTime: delivery.startDeliveringTime,
                deliveredTime: delivery.deliveredTime,
                orders: [delivery],
              });
            } else {
              groupedDeliveriesMap.get(key)?.orders.push(delivery);
            }
          });

          const groupedDeliveries = Array.from(groupedDeliveriesMap.values());

          setDeliveries(groupedDeliveries);
        } else {
          // Handle unsuccessful response
          setError("Failed to retrieve optimal path.");
          showErrorMessage("Failed to retrieve optimal path.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        showErrorMessage("An error occurred while fetching data.");
        console.error("Failed to get optimal path:", err);
      } finally {
        // Stop the loading indicator
        setLoading(false);
      }
    };

    fetchOptimalPath();
  }, [selectedOrders]);

  console.log("deliveriesNew", JSON.stringify(deliveries));

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#A1011A" />
          <Text className="mt-2 text-gray-700">Loading deliveries...</Text>
        </View>
      ) : (
        <View className="flex-1 bg-white">
          {/* Delivery Status */}
          <View className="flex-row justify-center my-2">
            <DeliveryStatus deliveries={deliveries} />
          </View>

          {/* Delivery Cards */}
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.point} delivery={delivery} />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default OptimizeDelivery;

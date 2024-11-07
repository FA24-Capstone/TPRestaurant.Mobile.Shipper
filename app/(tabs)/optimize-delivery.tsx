import DeliveryStatus from "@/components/Pages/Delivery/DeliveryStatus";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Delivery,
  DeliveryGroup,
  GetOptimalPathRequest,
  OptimalPathResult,
  Order,
} from "../types/order_type";
import { getOptimalPath, updateOrderDetailStatus } from "@/api/orderApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import DeliveryCard from "@/components/Pages/Delivery/DeliveryCard";

interface RouteParams {
  selectedOrders: string[];
}

const OptimizeDelivery: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedOrders } = route.params as RouteParams;
  const [isDelivering, setIsDelivering] = useState<boolean>(false);

  const [deliveries, setDeliveries] = useState<DeliveryGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // State for API cal
  // useRef to store the previously fetched data
  const cachedDeliveriesRef = useRef<DeliveryGroup[] | null>(null);
  const selectedOrdersRef = useRef<string[] | null>(null);
  // State to determine whether there are any orders with status 7
  const [hasStatus7, setHasStatus7] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's any order with status 7
    const status7Orders = selectedOrders.filter((order) =>
      deliveries.find((delivery) => delivery.status === 7)
    );
    setHasStatus7(status7Orders.length > 0);
  }, [deliveries, selectedOrders]);

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

  // Hàm fetchOptimalPath được định nghĩa bằng useCallback để memo hóa
  const fetchOptimalPath = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);

      try {
        // Kiểm tra nếu danh sách đơn hàng đã thay đổi hoặc ép buộc refetch
        const ordersChanged =
          !selectedOrdersRef.current ||
          selectedOrdersRef.current.length !== selectedOrders.length ||
          !selectedOrdersRef.current.every(
            (order, index) => order === selectedOrders[index]
          );

        if (!force && !ordersChanged && cachedDeliveriesRef.current) {
          // Nếu đơn hàng không thay đổi và không ép buộc, dùng dữ liệu cache
          setDeliveries(cachedDeliveriesRef.current);
          setLoading(false);
          return;
        }

        const response = await getOptimalPath(selectedOrders);

        if (response.isSuccess) {
          // Gắn tạm địa chỉ trước đó để bắt đầu xử lý tuyến đường
          let previousAddress =
            "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109";

          const mappedDeliveries = response.result.flatMap((item) => {
            const pointLetter = String.fromCharCode(65 + (item.index - 1));
            return item.orders.map((order) => {
              const delivery = {
                id: order.orderId,
                status: order.statusId,
                color:
                  order.statusId === 7
                    ? "#E3B054"
                    : order.statusId === 8
                    ? "#1D72C0"
                    : order.statusId === 9
                    ? "#4F970F"
                    : "#9A0E1D",
                time: item.duration,
                distanceToNextDestination: item.distanceFromPreviousDestination,
                startDeliveringTime: order.startDeliveringTime,
                deliveredTime: order.deliveredTime,
                assignedTime: order.assignedTime,
                order: order,
                address1: previousAddress,
                address2: order.account.address,
              };
              previousAddress = order.account.address || previousAddress;
              return delivery;
            });
          });

          // Gom nhóm theo địa chỉ giao hàng
          const groupedDeliveries = Array.from(
            mappedDeliveries.reduce((map, delivery) => {
              const addressKey = delivery.order.account.address || "";
              if (!map.has(addressKey)) {
                map.set(addressKey, {
                  point: String.fromCharCode(
                    65 +
                      (response.result.find((r) =>
                        r.orders.some((o) => o.orderId === delivery.id)
                      )?.index || 0) -
                      1
                  ),
                  status: delivery.status,
                  color: delivery.color,
                  address1: delivery.address1,
                  address2: delivery.address2,
                  time: delivery.time,
                  distanceToNextDestination: delivery.distanceToNextDestination,
                  startDeliveringTime: delivery.startDeliveringTime,
                  deliveredTime: delivery.deliveredTime,
                  orders: [delivery],
                });
              } else {
                map.get(addressKey)?.orders.push(delivery);
              }
              return map;
            }, new Map())
          ).map(([, group]) => group);

          setDeliveries(groupedDeliveries);
          cachedDeliveriesRef.current = groupedDeliveries;
          selectedOrdersRef.current = selectedOrders;
          showSuccessMessage("Fetched optimal path successfully.");
        } else {
          const errorMessage =
            response.messages.join("\n") || "Failed to retrieve optimal path.";
          showErrorMessage(errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        const errorMessage = "An error occurred while fetching data.";
        showErrorMessage(errorMessage);
        setError(errorMessage);
        console.error("Failed to get optimal path:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrders]
  );

  useFocusEffect(
    useCallback(() => {
      fetchOptimalPath(true); // Force refresh when the screen is focused
    }, [fetchOptimalPath])
  );

  // useEffect để refetch khi isDelivering thay đổi thành true
  useEffect(() => {
    if (isDelivering) {
      fetchOptimalPath(true).then(() => {
        // Reset isDelivering
        setIsDelivering(false);
      });
    }
  }, [isDelivering, fetchOptimalPath]);

  // console.log("isDeliveringNew", isDelivering);

  // console.log("deliveriesNew", JSON.stringify(deliveries));

  // Function to handle "Bắt đầu giao" button click
  const handleStartDelivery = async () => {
    setIsUpdating(true); // Show loading state

    try {
      // Update the status for all selected orders
      const responses = await Promise.all(
        selectedOrders.map((orderId) => updateOrderDetailStatus(orderId, true))
      );

      const allSuccess = responses.every((response) => response.isSuccess);

      if (allSuccess) {
        showSuccessMessage("Tất cả đơn hàng đã bắt đầu được giao!");
        setIsDelivering(true); // Trigger re-fetching
      } else {
        const failedOrders = responses
          .map((response, index) => ({
            response,
            orderId: selectedOrders[index],
          }))
          .filter((item) => !item.response.isSuccess)
          .map((item) => item.orderId);

        showErrorMessage(
          `Đã có lỗi xảy ra với đơn hàng: ${failedOrders.join(
            ", "
          )}. Vui lòng thử lại.`
        );
      }
    } catch (error) {
      console.error("Error updating order statuses:", error);
      showErrorMessage("Có gì đó không đúng, vui lòng thử lại sau.");
    } finally {
      setIsUpdating(false); // Stop loading state
    }
  };

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#A1011A" />
          <Text className="mt-2 text-gray-700">Đang tối ưu hoá ...</Text>
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
              <DeliveryCard
                key={delivery.point}
                delivery={delivery}
                setIsDelivering={setIsDelivering}
              />
            ))}
          </ScrollView>
          {/* Bottom Fixed "Bắt đầu giao" Button */}
          {/* Bottom Fixed "Bắt đầu giao" Button */}
          {hasStatus7 && (
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
              <TouchableOpacity
                disabled={isUpdating}
                className="w-full bg-[#FFA500] py-2 rounded-lg mt-2"
                onPress={handleStartDelivery}
              >
                <Text className="text-white text-center uppercase font-semibold text-base">
                  Bắt đầu giao
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default OptimizeDelivery;

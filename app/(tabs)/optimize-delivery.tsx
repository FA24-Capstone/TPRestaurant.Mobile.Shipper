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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchOrdersByStatus } from "@/redux/slices/orderSlice";

interface RouteParams {
  selectedOrders: string[];
}

const OptimizeDelivery: React.FC = () => {
  const cachedDeliveriesRef = useRef<DeliveryGroup[] | null>(null);
  const selectedOrdersRef = useRef<string[] | null>(null); // Lưu cache danh sách đơn hàng
  const accountId = useSelector((state: RootState) => state.auth.account?.id);
  const dispatch = useAppDispatch();

  const navigation = useNavigation();
  const route = useRoute();
  const { selectedOrders } = route.params as RouteParams;
  const [isDelivering, setIsDelivering] = useState<boolean>(false);

  const [deliveries, setDeliveries] = useState<DeliveryGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // State for API cal
  // useRef to store the previously fetched data
  // State to determine whether there are any orders with status 7
  const [shouldReload, setShouldReload] = useState(false);
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
          const defaultAddress =
            "78 Đường Lý Tự Trọng, Phường 2, TP Đà Lạt, Lâm Đồng 66109";

          let previousAddress = defaultAddress; // Bắt đầu với địa chỉ mặc định

          const mappedDeliveries = response.result.flatMap((item) => {
            return item.orders.map((order, index) => {
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
                address1: previousAddress || "Unknown Address", // Điểm từ là địa chỉ trước đó
                address2:
                  order.customerInfoAddress?.customerInfoAddressName ||
                  "Unknown Address", // Điểm đến là địa chỉ của đơn hàng
              };

              // Cập nhật `previousAddress` cho lần lặp tiếp theo
              previousAddress =
                order.customerInfoAddress?.customerInfoAddressName ||
                previousAddress;

              return delivery;
            });
          });

          // Gom nhóm các đơn hàng theo địa chỉ
          const groupedDeliveries = Array.from(
            mappedDeliveries.reduce((map, delivery, index) => {
              const addressKey = delivery.address2 || "";
              if (!map.has(addressKey)) {
                map.set(addressKey, {
                  point: String.fromCharCode(65 + index), // A, B, C...
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
        console.error("Failed to get optimal path:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrders]
  );

  useEffect(() => {
    if (
      !selectedOrdersRef.current ||
      selectedOrdersRef.current.length !== selectedOrders.length ||
      !selectedOrdersRef.current.every(
        (order, index) => order === selectedOrders[index]
      )
    ) {
      console.log("Refetching optimal path...");

      fetchOptimalPath(true); // Chỉ gọi lại khi danh sách đơn hàng thay đổi
    }
  }, [selectedOrders]);

  const handleReload = () => {
    fetchOptimalPath(true); // Gọi fetchOptimalPath với tham số force = true
  };

  // Dùng useFocusEffect để load lại mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      handleReload(); // Gọi
      fetchOptimalPath(true); // Gọi lại API nếu cần reload
    }, [fetchOptimalPath])
  );

  // useEffect để refetch khi isDelivering thay đổi thành true
  useEffect(() => {
    if (isDelivering) {
      fetchOptimalPath(true).then(() => {
        setIsDelivering(false); // Reset lại trạng thái
      });
    }
  }, [isDelivering, fetchOptimalPath]);

  // Function to handle "Bắt đầu giao" button click
  const handleStartDelivery = async () => {
    setIsUpdating(true); // Show loading state

    try {
      // Update the status for all selected orders
      const responses = await Promise.all(
        selectedOrders.map((orderId) =>
          updateOrderDetailStatus(orderId, true, 8)
        )
      );

      const allSuccess = responses.every((response) => response.isSuccess);

      if (allSuccess) {
        showSuccessMessage("Tất cả đơn hàng đã bắt đầu được giao!");
        setIsDelivering(true); // Trigger re-fetching

        // Dispatch thunk để refetch danh sách đơn hàng sau khi cập nhật thành công
        if (accountId) {
          const statuses = [7, 8];
          const fetchPromises = statuses.map((status) =>
            dispatch(
              fetchOrdersByStatus({
                shipperId: accountId,
                pageNumber: 1,
                pageSize: 1000,
                status,
              })
            )
          );

          // Chờ tất cả các dispatch hoàn thành
          const results = await Promise.allSettled(fetchPromises);

          // Xử lý lỗi từ các fetchOrdersByStatus
          const failedFetches = results.filter(
            (result) => result.status === "rejected"
          );

          if (failedFetches.length > 0) {
            failedFetches.forEach((failure) => {
              console.error("Fetch status failed:", failure);
              // Hiển thị thông báo lỗi từ từng dispatch thất bại
              showErrorMessage(
                failure.reason ||
                  "A system error occurred while updating statuses."
              );
            });
          }
        } else {
          showErrorMessage("Account ID is required.");
        }
      } else {
        const failedOrders = responses
          .map((response, index) => ({
            response,
            orderId: selectedOrders[index],
          }))
          .filter((item) => !item.response.isSuccess);

        failedOrders.forEach(({ orderId, response }) => {
          showErrorMessage(
            `Lỗi với đơn hàng ${orderId}: ${
              response.messages || "Không xác định"
            }.`
          );
        });
      }
    } catch (error) {
      console.error("Error updating order statuses:", error);
      if (error instanceof Error) {
        showErrorMessage(
          error.message || "Đã có lỗi xảy ra khi cập nhật trạng thái."
        );
      } else {
        showErrorMessage("Đã có lỗi xảy ra khi cập nhật trạng thái.");
      }
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
        <View className="flex-1 bg-white pb-20">
          <View className="flex-row justify-end items-center mx-4 mt-3">
            <TouchableOpacity
              onPress={handleReload}
              className="flex-row items-center"
            >
              <MaterialCommunityIcons name="reload" size={24} color="#A1011A" />
              <Text className="text-[#A1011A] ml-2 font-bold">Tải lại</Text>
            </TouchableOpacity>
          </View>

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
                typeMap="optimal"
              />
            ))}
          </ScrollView>
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

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { useFocusEffect, useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  GetAllOrdersByStatusParams,
  GetAllOrdersByStatusResponse,
  Order,
} from "../types/order_type";
import { getAllOrdersByShipper } from "@/api/orderApi";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import ScrollViewTabs from "@/components/Pages/Order/ScrollViewTabs";
import LoadingOverlay from "@/components/LoadingOverlay";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const initialLayout = { width: Dimensions.get("window").width };

// Define the types for navigation routes
type RootStackParamList = {
  OptimizeDelivery: { selectedOrders: string[] };
  OrderDetail: { orderId: string };
};

const OrderListDelivery: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // useRef để theo dõi trạng thái đã tải của từng `status`
  const loadedStatusRef = useRef({
    pending: false,
    delivering: false,
    delivered: false,
    cancelled: false,
  });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Chờ giao" },
    { key: "delivering", title: "Đang giao" },
    { key: "delivered", title: "Đã giao" },
    { key: "cancelled", title: "Đã hủy" },
  ]);
  const [isDelivering, setIsDelivering] = useState<boolean>(false);
  // console.log("selectedOrdersNHAA", JSON.stringify(selectedOrders));

  // State để lưu trữ các đơn hàng theo trạng thái
  const [ordersByStatus, setOrdersByStatus] = useState<{
    pending: Order[];
    delivering: Order[];
    delivered: Order[];
    cancelled: Order[];
  }>({
    pending: [],
    delivering: [],
    delivered: [],
    cancelled: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function để fetch orders từ API
  // Function để fetch orders từ API
  const fetchOrders = async (
    statusKey: keyof typeof loadedStatusRef.current,
    forceRefresh: boolean = false
  ) => {
    // Kiểm tra nếu dữ liệu đã được tải và không cần tải lại
    if (!forceRefresh && loadedStatusRef.current[statusKey]) return;

    setLoading(true);
    setError(null);
    try {
      const statuses: { [key: string]: number } = {
        pending: 7,
        delivering: 8,
        delivered: 9,
        cancelled: 10,
      };

      const params: GetAllOrdersByStatusParams = {
        shipperId: "584adfc1-b3d2-4aee-b2ee-e9007aca08c5",
        pageNumber: 1,
        pageSize: 10,
        status: statuses[statusKey],
      };

      const response: GetAllOrdersByStatusResponse =
        await getAllOrdersByShipper(params);
      if (response.isSuccess) {
        setOrdersByStatus((prevOrders) => ({
          ...prevOrders,
          [statusKey]: response.result.items,
        }));
        // Đánh dấu `status` này là đã được tải
        loadedStatusRef.current[statusKey] = true;
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Đã có lỗi xảy ra khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tất cả các trạng thái ban đầu khi trang được mở
  useEffect(() => {
    Object.keys(loadedStatusRef.current).forEach((key) => {
      fetchOrders(key as keyof typeof loadedStatusRef.current);
    });
  }, []);

  // Refetch khi `isDelivering` thay đổi để tải lại đơn hàng "Đang giao"
  useEffect(() => {
    if (isDelivering) {
      // Đánh dấu lại để có thể tải lại
      loadedStatusRef.current.delivering = false;
      fetchOrders("pending", true); // `forceRefresh` để bắt buộc tải lại
      fetchOrders("delivering", true); // `forceRefresh` để bắt buộc tải lại
      setIsDelivering(false);
    }
  }, [isDelivering]);

  // Re-fetch dữ liệu khi chuyển tab (dùng cho các trường hợp ngoại lệ)
  useFocusEffect(
    useCallback(() => {
      fetchOrders(routes[index].key as keyof typeof loadedStatusRef.current);
    }, [index])
  );

  // Refetch tất cả trạng thái khi nhấn nút "Tải lại"
  const handleReload = () => {
    Object.keys(loadedStatusRef.current).forEach((key) => {
      loadedStatusRef.current[key as keyof typeof loadedStatusRef.current] =
        false; // Đánh dấu tất cả trạng thái là chưa tải
    });
    Object.keys(loadedStatusRef.current).forEach((key) => {
      fetchOrders(key as keyof typeof loadedStatusRef.current, true); // Gọi fetch với forceRefresh = true
    });
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prevSelectedOrders) => {
      const updatedOrders = prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId];
      console.log("Selected Orders:", updatedOrders); // For debugging
      return updatedOrders;
    });
  };

  // console.log("ordersByStatus Orders:", JSON.stringify(ordersByStatus.pending)); // For debugging

  // Define each tab's content for react-native-tab-view
  const PendingRoute = () =>
    ordersByStatus.pending.length === 0 ? (
      <Text className="text-center text-gray-500 mt-4">
        Chưa có đơn hàng nào
      </Text>
    ) : (
      <OrderList
        orders={ordersByStatus.pending}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={true}
        onViewDetail={(orderId) =>
          navigation.navigate("OrderDetail", { orderId })
        }
        setIsDelivering={setIsDelivering}
      />
    );

  const DeliveringRoute = () =>
    ordersByStatus.delivering.length === 0 ? (
      <Text className="text-center text-gray-500 mt-4">
        Chưa có đơn hàng nào
      </Text>
    ) : (
      <OrderList
        orders={ordersByStatus.delivering}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={false}
        onViewDetail={(orderId) =>
          navigation.navigate("OrderDetail", { orderId })
        }
      />
    );

  const DeliveredRoute = () =>
    ordersByStatus.delivered.length === 0 ? (
      <Text className="text-center text-gray-500 mt-4">
        Chưa có đơn hàng nào
      </Text>
    ) : (
      <OrderList
        orders={ordersByStatus.delivered}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={false}
        onViewDetail={(orderId) =>
          navigation.navigate("OrderDetail", { orderId })
        }
      />
    );

  const CancelledRoute = () =>
    ordersByStatus.cancelled.length === 0 ? (
      <Text className="text-center text-gray-500 mt-4">
        Chưa có đơn hàng nào
      </Text>
    ) : (
      <OrderList
        orders={ordersByStatus.cancelled}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        isPending={false}
        onViewDetail={(orderId) =>
          navigation.navigate("OrderDetail", { orderId })
        }
      />
    );

  // Scene mapping for the TabView
  const renderScene = SceneMap({
    pending: PendingRoute,
    delivering: DeliveringRoute,
    delivered: DeliveredRoute,
    cancelled: CancelledRoute,
  });

  // Function to render TabView (for non-iOS platforms)
  const renderTabView = () => (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#A1011A" />
      ) : error ? (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={({ navigationState, jumpTo }) => (
            <View className="mx-4">
              {/* Nút Tải lại */}
              <TouchableOpacity
                onPress={handleReload}
                className="mx-4 mt-2 flex-row justify-end items-center"
              >
                <MaterialCommunityIcons
                  name="reload"
                  size={24}
                  color="#A1011A"
                />
                <Text className="text-[#A1011A] ml-2 text-center font-semibold text-base">
                  Tải lại
                </Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {navigationState.routes.map(
                  (
                    route: {
                      key: React.Key | null | undefined;
                      title:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    },
                    i: number
                  ) => {
                    const orderCount =
                      ordersByStatus[route.key as keyof typeof ordersByStatus]
                        .length;
                    return (
                      <View
                        key={route.key}
                        className="relative mt-4 flex-row space-x-4"
                      >
                        <TouchableOpacity
                          onPress={() =>
                            route.key && jumpTo(route.key as string)
                          }
                          className={`py-2 mr-3 px-4 rounded-lg ${
                            i === index ? "bg-[#A1011A]" : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-center font-semibold text-base ${
                              i === index ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {route.title}
                          </Text>

                          {/* Badge for displaying the count */}
                          {orderCount > 0 && (
                            <View
                              style={{
                                position: "absolute",
                                top: -10,
                                right: -5,
                                minWidth: 23,
                                height: 23,
                                borderRadius: 10,
                                backgroundColor: "#EDAA16",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                }}
                              >
                                {orderCount}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }
                )}
              </ScrollView>
            </View>
          )}
        />
      )}
      {/* Show optimization button if two or more orders are selected */}
      {selectedOrders.length >= 2 && !loading && !error && (
        <TouchableOpacity
          className="bg-white border-[#A1011A] border-2 py-3 mx-4 rounded-lg my-4"
          onPress={() =>
            navigation.navigate("OptimizeDelivery", { selectedOrders })
          }
        >
          <Text className="text-[#A1011A] text-center font-semibold text-lg">
            Tối ưu chặng đường
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white ">
      <WelcomeHeader />
      {Platform.OS === "ios" ? (
        <ScrollViewTabs
          ordersByStatus={ordersByStatus}
          selectedOrders={selectedOrders}
          handleSelectOrder={handleSelectOrder}
        />
      ) : (
        renderTabView()
      )}
    </View>
  );
};

export default OrderListDelivery;

import React, { useCallback, useEffect, useState } from "react";
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

const initialLayout = { width: Dimensions.get("window").width };

// Define the types for navigation routes
type RootStackParamList = {
  OptimizeDelivery: { selectedOrders: string[] };
  OrderDetail: { orderId: string };
};

const OrderListDelivery: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Giả sử statusId 4 là "pending", 6 là "delivering", 9 là "delivered", 10 là "cancelled"
      const statuses: { [key: string]: number } = {
        pending: 7,
        delivering: 8,
        delivered: 9,
        cancelled: 10,
      };

      const fetchedOrders: {
        pending: Order[];
        delivering: Order[];
        delivered: Order[];
        cancelled: Order[];
      } = {
        pending: [],
        delivering: [],
        delivered: [],
        cancelled: [],
      };

      for (const key in statuses) {
        const params: GetAllOrdersByStatusParams = {
          shipperId: "584adfc1-b3d2-4aee-b2ee-e9007aca08c5",
          pageNumber: 1,
          pageSize: 10, // Bạn có thể điều chỉnh số lượng theo nhu cầu
          status: statuses[key],
        };
        const response: GetAllOrdersByStatusResponse =
          await getAllOrdersByShipper(params);
        if (response.isSuccess) {
          fetchedOrders[key as keyof typeof fetchedOrders] =
            response.result.items;
        }
      }

      setOrdersByStatus(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Đã có lỗi xảy ra khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch order details when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  useEffect(() => {
    console.log("isDeliveringNe", isDelivering);

    if (isDelivering) {
      fetchOrders();
      setIsDelivering(false); // Đặt lại isDelivering về false sau khi refetch
    }
  }, [isDelivering]);

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
  const PendingRoute = () => (
    <OrderList
      orders={ordersByStatus["pending"]}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={true}
      onViewDetail={(orderId: string) =>
        navigation.navigate("OrderDetail", { orderId })
      }
      setIsDelivering={setIsDelivering}
    />
  );

  const DeliveringRoute = () => (
    <OrderList
      orders={ordersByStatus["delivering"]}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={(orderId: string) =>
        navigation.navigate("OrderDetail", { orderId })
      }
    />
  );

  const DeliveredRoute = () => (
    <OrderList
      orders={ordersByStatus["delivered"]}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={(orderId: string) =>
        navigation.navigate("OrderDetail", { orderId })
      }
    />
  );

  const CancelledRoute = () => (
    <OrderList
      orders={ordersByStatus["cancelled"]}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={(orderId: string) =>
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
            <View className="flex-row mx-4 my-4">
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
                  ) => (
                    <View key={route.key} className="flex-row space-x-4">
                      <TouchableOpacity
                        onPress={() => route.key && jumpTo(route.key as string)}
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
                      </TouchableOpacity>
                    </View>
                  )
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

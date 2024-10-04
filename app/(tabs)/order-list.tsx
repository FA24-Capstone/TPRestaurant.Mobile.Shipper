import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { useRouter } from "expo-router";

const initialLayout = { width: Dimensions.get("window").width };

const OrderListDelivery: React.FC = () => {
  const router = useRouter();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Chờ giao" },
    { key: "delivering", title: "Đang giao" },
    { key: "delivered", title: "Đã giao" },
    { key: "cancelled", title: "Đã hủy" },
  ]);

  const orders = [
    {
      id: "#351",
      distance: "5km",
      address: "S6.03, Vinhomes Grand Park, TP. Thủ Đức, TP. Hồ Chí Minh",
      time: "20 phút",
      status: "pending",
    },
    {
      id: "#352",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "delivering",
    },
    {
      id: "#353",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "delivered",
    },
    {
      id: "#354",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "cancelled",
    },
    {
      id: "#355",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "pending",
    },
    {
      id: "#356",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "pending",
    },
    {
      id: "#357",
      distance: "3km",
      address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      time: "15 phút",
      status: "pending",
    },
  ];

  // Filter orders based on their status
  const filterOrders = (status: string) =>
    orders.filter((order) => order.status === status);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prevSelectedOrders) => {
      const updatedOrders = prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId];
      console.log("Selected Orders:", updatedOrders); // For debugging
      return updatedOrders;
    });
  };

  // Define each tab's content for react-native-tab-view
  const PendingRoute = () => (
    <OrderList
      orders={filterOrders("pending")}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={true}
      onViewDetail={() => router.push("/order-detail")}
    />
  );

  const DeliveringRoute = () => (
    <OrderList
      orders={filterOrders("delivering")}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={() => router.push("/order-detail")}
    />
  );

  const DeliveredRoute = () => (
    <OrderList
      orders={filterOrders("delivered")}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={() => router.push("/order-detail")}
    />
  );

  const CancelledRoute = () => (
    <OrderList
      orders={filterOrders("cancelled")}
      selectedOrders={selectedOrders}
      onSelectOrder={handleSelectOrder}
      isPending={false}
      onViewDetail={() => router.push("/order-detail")}
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
      {/* Show optimization button if two or more orders are selected */}
      {selectedOrders.length >= 2 && (
        <TouchableOpacity className="bg-white border-[#A1011A] border-2 py-3 mx-4 rounded-lg my-4">
          <Text className="text-[#A1011A] text-center font-semibold text-lg">
            Tối ưu chặng đường
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Function to render ScrollView Tabs (for iOS)
  const renderScrollViewTabs = () => {
    const [selectedStatus, setSelectedStatus] = useState("pending");

    const filteredOrders = filterOrders(selectedStatus);

    const getTitle = (status: string) => {
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

    return (
      <>
        {/* Tabs with ScrollView */}
        <View className="flex-row mx-4 my-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  selectedStatus === "pending" ? "bg-[#A1011A]" : "bg-gray-200"
                }`}
                onPress={() => setSelectedStatus("pending")}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    selectedStatus === "pending"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Chờ giao
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  selectedStatus === "delivering"
                    ? "bg-[#A1011A]"
                    : "bg-gray-200"
                }`}
                onPress={() => setSelectedStatus("delivering")}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    selectedStatus === "delivering"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Đang giao
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  selectedStatus === "delivered"
                    ? "bg-[#A1011A]"
                    : "bg-gray-200"
                }`}
                onPress={() => setSelectedStatus("delivered")}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    selectedStatus === "delivered"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Đã giao
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 rounded-lg ${
                  selectedStatus === "cancelled"
                    ? "bg-[#A1011A]"
                    : "bg-gray-200"
                }`}
                onPress={() => setSelectedStatus("cancelled")}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    selectedStatus === "cancelled"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Đã huỷ
                </Text>
              </TouchableOpacity>
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
          onViewDetail={() => router.push("/order-detail")}
        />

        {/* Show optimization button if two or more orders are selected */}
        {selectedOrders.length >= 2 && (
          <TouchableOpacity className="bg-white border-[#A1011A] border-2 py-3 mx-4 rounded-lg my-4">
            <Text className="text-[#A1011A] text-center font-semibold text-lg">
              Tối ưu chặng đường
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View className="flex-1 bg-white ">
      <WelcomeHeader />
      {Platform.OS === "ios" ? renderScrollViewTabs() : renderTabView()}
    </View>
  );
};

export default OrderListDelivery;

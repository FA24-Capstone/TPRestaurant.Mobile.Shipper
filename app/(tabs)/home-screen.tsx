import OrderChart from "@/components/Pages/Home/OrderChart";
import OrderSummary from "@/components/Pages/Home/OrderSummary";
import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { GetAllOrdersByStatusParams, Order } from "../types/order_type";
import { getAllOrdersByShipper } from "@/api/orderApi";
import { formatDate, getLast7Days } from "@/constants/dateUtils";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import * as signalR from "@microsoft/signalr"; // Import SignalR
import { fetchOrdersByStatus } from "@/redux/slices/orderSlice";
import { fetchNotifications } from "@/redux/slices/notificationSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const HomeScreen = () => {
  const router = useRouter(); // Sử dụng useRouter để điều hướng
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);

  const ordersState = useSelector((state: RootState) => state.orders);
  const profile = useSelector((state: RootState) => state.auth.account);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [cancelledOrders, setCancelledOrders] = useState<number>(0); // New state
  const [allOrders, setAllOrders] = useState<Order[]>([]); // New state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const retryCountRef = useRef<number>(0);
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000; // 3 seconds
  console.log("completedOrders", completedOrders);
  console.log("cancelledOrders", cancelledOrders);
  // console.log("allOrders", JSON.stringify(allOrders, null, 2));

  // Fetch all orders
  const fetchAllOrders = useCallback(async () => {
    // if (hasFetchedRef.current) return; // Ngăn gọi lại không cần thiết
    // hasFetchedRef.current = true;

    try {
      if (!profile?.id) {
        throw new Error("Shipper ID không tồn tại.");
      }

      let pageNumber = 1;
      const pageSize = 100;
      let fetchedOrders: Order[] = [];
      let totalPages = 1;

      setLoading(true);
      setError(null); // Reset error before fetching

      while (pageNumber <= totalPages) {
        const params: GetAllOrdersByStatusParams = {
          shipperId: profile.id,
          pageNumber,
          pageSize,
        };

        const response = await getAllOrdersByShipper(params);
        console.log("response", response);

        if (response.isSuccess) {
          fetchedOrders = [...fetchedOrders, ...response.result.items];
          totalPages = response.result.totalPages;
          pageNumber += 1;
        } else {
          showErrorMessage(
            response.messages.join(", ") || "Failed to retrieve orders."
          );
          throw new Error(response.messages.join(", "));
        }
      }

      setAllOrders(fetchedOrders);

      // Filter orders
      const completed = fetchedOrders.filter(
        (order) => order.statusId === 9
      ).length;
      const pending = fetchedOrders.filter(
        (order) => order.statusId === 7 || order.statusId === 8
      ).length;
      const cancelled = fetchedOrders.filter(
        (order) => order.statusId === 10 // Assuming 10 is the statusId for cancelled
      ).length;

      setCompletedOrders(completed);
      setPendingOrders(pending);
      setCancelledOrders(cancelled);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      const errorMessage =
        err.message || "An error occurred while fetching orders.";
      setError(errorMessage);
      showErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm tạo chartData từ allOrders dựa trên 7 ngày gần nhất từ ngày hiện tại
  const generateChartData = useCallback((): {
    day: string;
    completed: number;
    cancelled: number;
  }[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 0 để so sánh ngày chính xác

    const last7Days = getLast7Days(today); // Lấy 7 ngày gần nhất từ ngày hôm nay

    // Khởi tạo mảng chartData với 0
    const chartData = last7Days.map((date) => ({
      day: formatDate(date),
      completed: 0,
      cancelled: 0,
    }));

    // Đếm số lượng đơn hàng cho từng ngày
    allOrders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      orderDate.setHours(0, 0, 0, 0); // Đặt giờ về 0 để so sánh ngày chính xác

      last7Days.forEach((date, index) => {
        if (
          orderDate.getDate() === date.getDate() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        ) {
          if (order.statusId === 9) {
            chartData[index].completed += 1;
          } else if (order.statusId === 10) {
            chartData[index].cancelled += 1;
          }
        }
      });
    });

    return chartData;
  }, [allOrders]);

  // Set up SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Start SignalR connection and handle events
  useEffect(() => {
    if (connection) {
      const startConnection = async () => {
        try {
          await connection.start();
          console.log("Connected to SignalR");
          showSuccessMessage("Connected to SignalR");

          // Subscribe to SignalR events
          connection.on("LOAD_ASSIGNED_ORDER", () => {
            console.log("Received LOAD_ASSIGNED_ORDER event");
            fetchAllOrders();

            // Gọi fetchNotifications trong Redux
            if (profile?.id) {
              dispatch(fetchNotifications(profile.id));
            } else {
              console.error(
                "Cannot fetch notifications: Shipper ID is missing."
              );
            }
          });
        } catch (error) {
          console.error("Connection error:", error);
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            setTimeout(() => {
              startConnection();
            }, RETRY_DELAY);
          } else {
            console.log("Max retries reached. Could not connect to SignalR.");
          }
        }
      };

      startConnection();

      return () => {
        if (connection) {
          connection.off("LOAD_ASSIGNED_ORDER");
          connection.stop();
        }
      };
    }
  }, [connection, fetchAllOrders, dispatch, profile?.id]);

  // Fetch orders when profile.id is available
  useEffect(() => {
    if (profile?.id) {
      fetchAllOrders();
      dispatch(fetchNotifications(profile.id));
    }
  }, [profile?.id, fetchAllOrders, profile?.id, dispatch]);

  const chartData = generateChartData();
  console.log("chartData", chartData);

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white">
  //       <ActivityIndicator size="large" color="#970C1A" />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-[#970C1A] rounded"
          onPress={fetchAllOrders} // Call fetchAllOrders on retry
        >
          <Text className="text-white">Thử Lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Update fakeData to use actual data or keep using fakeData for demonstration
  const fakeData = {
    completedOrders: completedOrders,
    pendingOrders: pendingOrders,
    cancelledOrders: cancelledOrders,
  };

  return (
    <View className="bg-white flex-1">
      <WelcomeHeader />
      {loading && <ActivityIndicator size="large" color="#970C1A" />}
      <TouchableOpacity
        onPress={fetchAllOrders}
        className="mx-4 mt-2 flex-row justify-end items-center"
      >
        <MaterialCommunityIcons name="reload" size={24} color="#A1011A" />
        <Text className="text-[#A1011A] ml-2 text-center font-semibold text-base">
          Tải lại
        </Text>
      </TouchableOpacity>
      <OrderSummary
        completedOrders={completedOrders}
        pendingOrders={pendingOrders}
      />
      <ScrollView className="flex-1">
        <OrderChart chartData={chartData} />
        {/* Truyền limit={2} để giới hạn số đơn hiển thị */}
        <View className="mx-6">
          <Text className="font-semibold text-[#970C1A] uppercase text-lg text-center">
            Hướng dẫn sử dụng
          </Text>
          <Text className="font-semibold text-lg text-gray-600 mb-2 uppercase text-center">
            App Shipper Nhà hàng Thiên Phú
          </Text>
          {/* Thêm hướng dẫn các bước sử dụng */}
          <View className="my-4">
            <Text className="text-base text-gray-800 mb-2">
              1. Chọn đơn và ấn{" "}
              <Text className="font-semibold">"Giao Ngay"</Text> từ danh sách{" "}
              <Text className="font-semibold">"Đang chờ"</Text> để bắt đầu giao
              hàng hoặc chọn{" "}
              <Text className="font-semibold">
                "Tối ưu chặng đường và giao ngay"
              </Text>{" "}
              để bắt đầu giao hàng loạt.
            </Text>
            <Text className="text-base text-gray-800 mb-2">
              2. Kiểm tra chi tiết đơn hàng và nhấn{" "}
              <Text className="font-semibold">"Xem bản đồ"</Text> để dẫn đường.
            </Text>
            <Text className="text-base text-gray-800 mb-2">
              3. Sau khi đến nơi, chụp ảnh xác nhận và bấm{" "}
              <Text className="font-semibold">"Hoàn thành"</Text>.
            </Text>
            <Text className="text-base text-gray-800 mb-2">
              4. Đơn hàng hoàn tất sẽ chuyển sang trạng thái{" "}
              <Text className="font-semibold">"Hoàn thành"</Text>.
            </Text>
            <Text className="text-base text-gray-800">
              5. Bạn có thể kiểm tra lại lịch sử giao hàng trong phần{" "}
              <Text className="font-semibold">"Đã giao"</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

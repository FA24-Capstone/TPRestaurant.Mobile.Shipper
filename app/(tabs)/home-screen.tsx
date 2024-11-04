import OrderChart from "@/components/Pages/Home/OrderChart";
import OrderSummary from "@/components/Pages/Home/OrderSummary";
import WelcomeHeader from "@/components/Pages/Home/WelcomeHeader";
import OrderList from "@/components/Pages/Order/OrderList";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { GetAllOrdersByStatusParams, Order } from "../types/order_type";
import { getAllOrdersByShipper } from "@/api/orderApi";
// import { jwtDecode } from "jwt-decode";

const HomeScreen = () => {
  const router = useRouter(); // Sử dụng useRouter để điều hướng
  const profile = useSelector((state: RootState) => state.auth.account);

  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6IjkzNzM2NTYzMiIsImp0aSI6ImZiNzk4YzY1LTNiMjktNDM2YS1iZTJhLTU0MDI5ODNhMWMwOCIsIkFjY291bnRJZCI6IjU4NGFkZmMxLWIzZDItNGFlZS1iMmVlLWU5MDA3YWNhMDhjNSIsInJvbGUiOiJTSElQUEVSIiwiZXhwIjoxNzMwNzY0ODAwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MDIyIiwiYXVkIjoiTW9uIn0.jeUD3iickdoRePOYiHHwTdxa3J7CYikRHyyGa_NgkpE";
  //   try {
  //     const decoded = jwtDecode(token);
  //     console.log("Decoded Token:", decoded);
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // }, []);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        if (!profile?.id) {
          throw new Error("Shipper ID không tồn tại.");
        }

        let pageNumber = 1;
        const pageSize = 100;
        let allOrders: Order[] = [];
        let totalPages = 1;

        while (pageNumber <= totalPages) {
          const params: GetAllOrdersByStatusParams = {
            shipperId: profile.id,
            pageNumber,
            pageSize,
          };

          const response = await getAllOrdersByShipper(params);

          if (response.isSuccess) {
            allOrders = [...allOrders, ...response.result.items];
            totalPages = response.result.totalPages;
            pageNumber += 1;
          } else {
            throw new Error(response.messages.join(", "));
          }
        }

        // Lọc đơn hàng
        const completed = allOrders.filter(
          (order) => order.statusId === 9
        ).length;
        const pending = allOrders.filter(
          (order) => order.statusId !== 9 && order.statusId !== 10
        ).length;

        setCompletedOrders(completed);
        setPendingOrders(pending);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Đã xảy ra lỗi khi lấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [profile?.id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#970C1A" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-[#970C1A] rounded"
          onPress={() => {
            setLoading(true);
            setError(null);
            // Gọi lại hàm fetchOrders nếu cần
          }}
        >
          <Text className="text-white">Thử Lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fakeData = {
    completedOrders: 20,
    pendingOrders: 8,
    chartData: [
      { day: "Mon", value: 6000 },
      { day: "Tue", value: 4000 },
      { day: "Wed", value: 5500 },
      { day: "Thu", value: 15980 },
      { day: "Fri", value: 6000 },
      { day: "Sat", value: 7500 },
      { day: "Sun", value: 5000 },
    ],
  };

  return (
    <View className="bg-white flex-1">
      <WelcomeHeader />
      <OrderSummary
        completedOrders={completedOrders}
        pendingOrders={pendingOrders}
      />
      <ScrollView className="flex-1">
        <OrderChart chartData={fakeData.chartData} />
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

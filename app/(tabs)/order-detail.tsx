import ImageGallery from "@/components/ImageGallery";
import CustomerInfo from "@/components/Pages/Order/Detail/CustomerInfo";
import LineDelivery from "@/components/Pages/Order/Detail/LineDelivery";
import OrderActions from "@/components/Pages/Order/Detail/OrderActions";
import OrderDishes from "@/components/Pages/Order/Detail/OrderItems";
import OrderSummary from "@/components/Pages/Order/Detail/OrderSummary";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Image, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../types/types";
import {
  GetHistoryOrderIdReponse,
  OrderHistoryData,
} from "../types/order_type";
import { getOrderId } from "@/api/orderApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
const images = [
  "https://driver.shopeefood.vn/media/filer_public_thumbnails/filer_public/36/95/3695c8cb-b437-4d21-b3c8-5ad709c9576e/11.png__600x864_q95_subsampling-2.png",
  "https://image.bnews.vn/MediaUpload/Org/2020/11/22/20201122-145154.jpg",
  "https://channel.mediacdn.vn/2021/9/15/photo-6-16316977699281502595991.jpg",
];

type OrderDetailRouteProp = RouteProp<RootStackParamList, "OrderDetail">;

const OrderDetail = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params; // Lấy orderId từ params

  const [orderData, setOrderData] = useState<OrderHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // console.log("orderDataNE", JSON.stringify(orderData));

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

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching order details for orderId:", orderId);
      const response = await getOrderId(orderId);

      if (response.isSuccess) {
        setOrderData(response.result);
        // showSuccessMessage("Order details loaded successfully.");
      } else {
        const errorMessage =
          response.messages[0] || "Không thể tải chi tiết đơn hàng.";
        setError(errorMessage);
        showErrorMessage(errorMessage);
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      const errorMessage =
        error.message || "Đã có lỗi xảy ra khi tải chi tiết đơn hàng.";
      setError(errorMessage);
      showErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Hàm để làm mới dữ liệu đơn hàng
  const refetchOrderDetails = () => {
    fetchOrderDetails();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#A1011A" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable content */}
      <ScrollView className="flex-1 p-4 mb-20">
        {/* Adjusted margin to avoid overlapping with bottom button */}
        {/* Thông tin khách hàng */}
        {orderData && orderData.order.account && (
          <CustomerInfo customerData={orderData.order} />
        )}
        {/* Trạng thái đơn hàng và địa chỉ */}
        {orderData && orderData.order.validatingImg && (
          <View>
            <Text className="font-semibold text-lg text-gray-600 mb-2">
              Hình ảnh đã giao: {""}
              <Text className="font-bold text-gray-800">
                (Shipper: {orderData?.order?.shipper?.firstName}{" "}
                {orderData?.order?.shipper?.lastName})
              </Text>
            </Text>
            <ImageGallery image={orderData.order.validatingImg} />
          </View>
        )}
        {orderData && <LineDelivery orderData={orderData.order} />}
        {/* Tóm tắt đơn hàng */}
        {orderData && <OrderSummary orderData={orderData.order} />}
        {/* Horizontal line (divider) */}
        <View className="border-b border-gray-300 my-4" />
        {/* Danh sách món ăn */}
        {orderData && <OrderDishes dishes={orderData.orderDishes} />}
      </ScrollView>

      {/* Order actions placed at the bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4">
        {orderData && (
          <OrderActions
            orderData={orderData.order}
            onRefetch={refetchOrderDetails}
          />
        )}
      </View>
    </View>
  );
};

export default OrderDetail;

import ImageGallery from "@/components/ImageGallery";
import CustomerInfo from "@/components/Pages/Order/Detail/CustomerInfo";
import LineDelivery from "@/components/Pages/Order/Detail/LineDelivery";
import OrderActions from "@/components/Pages/Order/Detail/OrderActions";
import OrderDishes from "@/components/Pages/Order/Detail/OrderItems";
import OrderSummary from "@/components/Pages/Order/Detail/OrderSummary";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, View, Image } from "react-native";
const images = [
  "https://driver.shopeefood.vn/media/filer_public_thumbnails/filer_public/36/95/3695c8cb-b437-4d21-b3c8-5ad709c9576e/11.png__600x864_q95_subsampling-2.png",
  "https://image.bnews.vn/MediaUpload/Org/2020/11/22/20201122-145154.jpg",
  "https://channel.mediacdn.vn/2021/9/15/photo-6-16316977699281502595991.jpg",
];

const OrderDetail = () => {
  const navigation = useNavigation();
  const router = useRouter(); // Sử dụng useRouter để điều hướng

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

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable content */}
      <ScrollView className="flex-1 p-4 mb-20">
        {/* Adjusted margin to avoid overlapping with bottom button */}
        {/* Thông tin khách hàng */}
        <CustomerInfo />
        {/* Trạng thái đơn hàng và địa chỉ */}
        <View>
          <Text className="font-semibold text-lg text-gray-600 mb-2">
            Hình ảnh đã giao:
          </Text>
          <ImageGallery images={images} />
        </View>
        <LineDelivery />
        {/* Tóm tắt đơn hàng */}
        <OrderSummary />
        {/* Horizontal line (divider) */}
        <View className="border-b border-gray-300 my-4" />
        {/* Danh sách món ăn */}
        <OrderDishes />
      </ScrollView>

      {/* Order actions placed at the bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4">
        <OrderActions />
      </View>
    </View>
  );
};

export default OrderDetail;

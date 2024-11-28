import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import {
  showSuccessMessage,
  showErrorMessage,
} from "@/components/FlashMessageHelpers";
import { uploadConfirmedOrderImage } from "@/api/orderApi";
import LoadingOverlay from "@/components/LoadingOverlay";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchOrdersByStatus } from "@/redux/slices/orderSlice";
import { useSelector } from "react-redux";
import * as Location from "expo-location"; // Import Location from Expo

interface RouteParams {
  orderIds: string[];
}

const OrderUploadList: React.FC = () => {
  const dispatch = useAppDispatch();

  const route = useRoute();
  const navigation = useNavigation();
  const { orderIds } = route.params as RouteParams;
  const accountId = useSelector((state: RootState) => state.auth.account?.id);

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);
  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (
        cameraStatus !== "granted" ||
        galleryStatus !== "granted" ||
        locationStatus !== "granted"
      ) {
        showErrorMessage(
          "Permissions Required, Permissions to access camera, gallery, and location are required!"
        );
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        showErrorMessage("Failed to get location. Please try again.");
      }
    };

    getLocation();
  }, []);
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      showErrorMessage(
        "Hãy chụp hoặc chọn một ảnh để áp dụng cho tất cả đơn hàng."
      );
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = orderIds.map((orderId) =>
        uploadConfirmedOrderImage({
          orderId: orderId,
          image: image,
          lat: location?.lat || 0,
          lng: location?.lng || 0,
          isSuccessful: true,
        })
      );

      const results = await Promise.allSettled(uploadPromises);

      const failedUploads = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedUploads.length > 0) {
        showErrorMessage(`${failedUploads.length} đơn hàng không thể tải lên.`);
      } else {
        showSuccessMessage("Tất cả đơn hàng đã được giao!");
        navigation.goBack();

        // Dispatch thunk để refetch danh sách đơn hàng sau khi cập nhật thành công
        if (accountId) {
          const statuses = [8, 9];
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
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      showErrorMessage("Có lỗi xảy ra khi tải lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.8;

  return (
    <>
      {uploading && <LoadingOverlay visible={uploading} />}
      <ScrollView
        className="flex-1 bg-white px-4 pt-6 pb-32"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-sm font-semibold text-center text-[#A1011A] mb-4">
          Chụp hoặc chọn một ảnh để áp dụng cho tất cả đơn hàng:
        </Text>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: 10,
              marginBottom: 16,
              marginHorizontal: "auto",
            }}
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity
            onPress={pickImageFromGallery}
            style={styles.placeholder}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={40}
              color="gray"
            />
            <Text className="text-gray-600 text-center">
              Chọn hoặc chụp ảnh
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex-row mt-4 justify-between">
          <TouchableOpacity
            onPress={pickImageFromGallery}
            className="p-3 rounded w-[48%] bg-gray-200"
          >
            <Text className="text-center font-semibold uppercase text-gray-800">
              Chọn ảnh
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImageFromCamera}
            className="p-3 rounded w-[48%] bg-gray-500"
          >
            <Text className="text-center font-semibold uppercase text-white">
              Chụp ảnh
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white">
        <TouchableOpacity
          onPress={handleUpload}
          className="p-4 rounded bg-[#A1011A]"
        >
          <Text className="text-white text-center text-lg font-bold">
            HOÀN THÀNH
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "gray",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
});

export default OrderUploadList;

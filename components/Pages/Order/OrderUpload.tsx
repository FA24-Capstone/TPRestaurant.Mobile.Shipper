import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo
import * as Location from "expo-location"; // Import Location from Expo
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  showSuccessMessage,
  showErrorMessage,
} from "@/components/FlashMessageHelpers";
import { useRoute } from "@react-navigation/native";
import { uploadConfirmedOrderImage } from "@/api/orderApi";
import LoadingOverlay from "@/components/LoadingOverlay";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchOrdersByStatus } from "@/redux/slices/orderSlice";
import { useSelector } from "react-redux";

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: { orderId: string };
};

interface RouteParams {
  orderId: string;
  typeMap: string;
}

const OrderUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const router = useRouter();

  const { orderId, typeMap } = route.params as RouteParams;
  console.log("orderIdtypeMap", orderId, typeMap);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const accountId = useSelector((state: RootState) => state.auth.account?.id);

  // State for storing multiple images
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        showErrorMessage("Failed to get location. Please try again.");
      }
    };

    getLocation();
  }, []);

  // Handle Image Picker from Gallery
  const pickImageFromGallery = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showErrorMessage("You need to grant permission to access the gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    console.log("result.assets", result.assets);

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle Camera Picker
  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle saving
  const handleSave = async () => {
    if (!image) {
      showErrorMessage("Please upload or capture one proof of delivery image.");
      return;
    }
    if (!orderId) {
      showErrorMessage("Order Id is required.");
      return;
    }
    if (!location) {
      showErrorMessage("Bạn vui lòng chờ chút để xác định vị trí!");
      return;
    }

    setUploading(true);
    try {
      // Call the upload API function
      console.log("dataUpload", {
        location: location,
        lat: location.latitude,
        lng: location.longitude,
        isSuccessful: true,
      });
      const response = await uploadConfirmedOrderImage({
        orderId: orderId,
        image: image,
        lat: location.latitude,
        lng: location.longitude,
        isSuccessful: true,
      });
      console.log("responseUpload", response);

      if (response.isSuccess) {
        console.log("Image uploaded successfully:", response);

        showSuccessMessage("Đơn hàng này đã được giao!");
        //( navigation.replace("OrderDetail", { orderId });
        if (typeMap === "optimal") {
          router.back();
        } else {
          navigation.goBack();
        }

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

        // Finally, navigate to OrderDetail
      } else {
        const errorMessage =
          response.messages[0] || "Failed to upload the image.";
        showErrorMessage(errorMessage);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showErrorMessage(
        error.message || "Failed to upload the image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Get the screen width to calculate image size
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth; // 2 columns with some spacing

  return (
    <>
      {uploading && <LoadingOverlay visible={uploading} />}
      <View className="flex-1 bg-white px-4 py-6">
        {image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 10,
                margin: "auto",
              }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImageFromGallery}
            style={{
              width: "100%",
              height: 200,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: "gray",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F9F9F9",
            }}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={40}
              color="gray"
            />
            <Text className="text-gray-600">Take proof of delivery photo</Text>
          </TouchableOpacity>
        )}

        <View className="flex-row space-x-2 mt-4">
          <TouchableOpacity
            onPress={pickImageFromCamera}
            className="p-3 rounded bg-gray-300 w-[48%]"
          >
            <Text className="text-center text-gray-800">Chụp ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImageFromGallery}
            className="p-3 rounded bg-gray-300 w-[48%]"
          >
            <Text className="text-center text-gray-800">Chọn từ thư viện</Text>
          </TouchableOpacity>
        </View>

        <View className="py-4">
          <TouchableOpacity
            className="p-4 rounded bg-[#A1011A]"
            onPress={handleSave}
          >
            <Text className="text-white text-center text-lg font-bold">
              HOÀN THÀNH
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    margin: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 50,
  },
});

export default OrderUpload;

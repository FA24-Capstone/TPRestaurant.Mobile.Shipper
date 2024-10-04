import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  showSuccessMessage,
  showErrorMessage,
} from "@/components/FlashMessageHelpers";

// Define the types for navigation routes
type RootStackParamList = {
  OrderDetail: undefined;
};

const OrderUpload: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // State for storing multiple images
  const [images, setImages] = useState<string[]>([]);

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
    const getPermission = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || galleryStatus !== "granted") {
        showErrorMessage(
          "Permissions Required, Permissions to access camera and gallery are required!"
        );
      }
    };
    getPermission();
  }, []);

  // Handle Image Picker from Gallery
  const pickImageFromGallery = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the gallery."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]); // Add selected images to the list
    }
  };

  // Handle Camera Picker
  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImages([...images, result.assets[0].uri]); // Add captured image to the list
    }
  };

  // Function to handle saving
  const handleSave = () => {
    if (images.length === 0) {
      Alert.alert(
        "Error",
        "Please upload at least one proof of delivery image."
      );
      return;
    }
    showSuccessMessage("Your delivery proof has been uploaded successfully.");
    navigation.replace("OrderDetail");
  };

  // Function to delete an image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index)); // Remove image by index
  };

  // Get the screen width to calculate image size
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth / 2 - 30; // 2 columns with some spacing

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* FlatList to display all selected or captured images */}
      <FlatList
        data={images}
        numColumns={2} // Show 2 items per row
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
            {/* Delete Button in the top-right corner */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeImage(index)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
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
      />

      {/* Button to Retake or Select from Camera */}
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

      {/* Save Button */}
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

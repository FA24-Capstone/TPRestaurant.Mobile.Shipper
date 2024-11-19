import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateAccount } from "@/api/profileApi"; // Import your updateAccount API function
import { AccountProfile } from "@/app/types/profile_type";
import moment from "moment-timezone";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { useRouter } from "expo-router";
import LoadingOverlay from "@/components/LoadingOverlay";

const UpdateProfile = () => {
  const router = useRouter();
  const account = useSelector(
    (state: RootState) => state.auth.account
  ) as AccountProfile;
  const [firstName, setFirstName] = useState(account?.firstName);
  const [lastName, setLastName] = useState(account?.lastName);
  const [dob, setDob] = useState(
    account?.dob ? moment(account.dob).format("DD/MM/YYYY") : ""
  );
  const [gender, setGender] = useState(account?.gender);
  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber);
  const [address, setAddress] = useState(account?.address ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(
    account?.avatar ?? undefined
  );
  const [isImagePickerModalVisible, setImagePickerModalVisible] =
    useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);

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

    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
    setImagePickerModalVisible(false); // Close modal after selecting
  };

  // Handle Camera Picker
  const pickImageFromCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      showErrorMessage("You need to grant permission to access the camera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
    setImagePickerModalVisible(false); // Close modal after capturing
  };

  const handleImageUpload = async () => {
    setImagePickerModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!avatar) {
      showErrorMessage("Please upload or capture one proof of delivery image.");
      return;
    }
    setUploading(true);
    const formattedDob = moment(dob, "DD/MM/YYYY")
      //   .add(1, "day")
      .format("YYYY-MM-DD");

    try {
      const isAvatarUpdated = avatar && avatar !== account.avatar;

      const response = await updateAccount(
        account.id,
        firstName,
        lastName,
        formattedDob,
        gender,
        isAvatarUpdated ? avatar : undefined // Truyền avatar nếu đã thay đổi
      );
      // Handle success notification or navigation here
      if (response.isSuccess) {
        showSuccessMessage("Hồ sơ đã được cập nhật!");
        router.push("/my-profile");
      } else {
        const errorMessage =
          response.messages[0] || "Failed to upload the image.";
        showErrorMessage("Cập nhật hồ sơ thất bại: " + errorMessage);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showErrorMessage("Failed to upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    const formattedDate = moment(selectedDate).format("DD/MM/YYYY");

    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );

    if (selectedDate > minDate) {
      showErrorMessage("Shipper Thiên Phú phải từ 16 tuổi trở lên!");
    } else {
      setDob(formattedDate); // Lưu ngày sinh ở định dạng yyyy-mm-dd
    }
    hideDatePicker();
  };

  return (
    <>
      {uploading && <LoadingOverlay visible={uploading} />}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            backgroundColor: "white",
          }}
        >
          {/* Avatar with camera icon */}
          <View className="flex items-center mb-6">
            <View className="relative">
              <Image
                source={{
                  uri:
                    avatar ||
                    "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
                }}
                className="w-40 h-40 rounded-full border-4 border-gray-300"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-300"
                onPress={handleImageUpload}
              >
                <FontAwesome name="camera" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal for selecting image source */}
          <Modal
            transparent={true}
            visible={isImagePickerModalVisible}
            animationType="slide"
            onRequestClose={() => setImagePickerModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
              <View className="w-3/4 bg-white rounded-lg p-5">
                <Text className="text-lg font-semibold mb-4 text-center">
                  Chọn hình ảnh
                </Text>
                <View className="flex-row items-center mb-4 justify-between">
                  <TouchableOpacity
                    className="bg-gray-300 w-[48%] px-4 py-3  rounded-md"
                    onPress={pickImageFromGallery}
                  >
                    <Text className="text-center uppercase text-gray-700 font-semibold">
                      Tải lên
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-gray-300 w-[48%] px-4 py-3 rounded-md"
                    onPress={pickImageFromCamera}
                  >
                    <Text className="text-center uppercase  text-gray-700 font-semibold">
                      Chụp ảnh
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="py-2"
                  onPress={() => setImagePickerModalVisible(false)}
                >
                  <Text className="text-center uppercase  text-gray-600 font-bold">
                    Hủy{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Form Inputs */}
          <View className="space-y-4">
            <TextInput
              label="Họ / Tên đệm"
              value={firstName}
              onChangeText={setFirstName}
              mode="flat"
              className="bg-white text-lg border-2 border-gray-200 font-semibold"
              underlineColor="transparent"
              style={{ backgroundColor: "transparent" }}
              theme={{ colors: { primary: "#888" } }}
            />
            <TextInput
              label="Tên"
              value={lastName}
              onChangeText={setLastName}
              mode="flat"
              className="bg-white text-lg  border-2 border-gray-200 font-semibold"
              underlineColor="transparent"
              style={{ backgroundColor: "transparent" }}
              theme={{ colors: { primary: "#888" } }}
            />
            <TextInput
              label="Số điện thoại (+84)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="flat"
              className="bg-white text-lg  border-2 border-gray-200 font-semibold"
              underlineColor="transparent"
              style={{ backgroundColor: "transparent" }}
              theme={{ colors: { primary: "#888" } }}
            />
            {/* Date of Birth Input with Calendar Icon */}
            <View className="flex-row items-center border-2 border-gray-200 rounded-md">
              <TextInput
                label="Ngày sinh"
                value={dob}
                mode="flat"
                className="flex-1 bg-white font-semibold text-lg rounded-md"
                underlineColor="transparent"
                style={{ backgroundColor: "transparent" }}
                theme={{ colors: { primary: "#888" } }}
                editable={false}
              />
              <TouchableOpacity onPress={showDatePicker} className="ml-2 mx-4">
                <FontAwesome name="calendar" size={24} color="#888" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={
                  new Date(
                    new Date().getFullYear() - 16,
                    new Date().getMonth(),
                    new Date().getDate() - 1
                  )
                } // Chỉ cho phép chọn ngày <= ngày 16 năm trước
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>
            <TextInput
              label="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              mode="flat"
              className="bg-white text-lg mb-2  border-2 border-gray-200 font-semibold"
              underlineColor="transparent"
              style={{ backgroundColor: "transparent" }}
              theme={{ colors: { primary: "#888" } }}
            />

            {/* Gender Selection */}
            <View className="flex-row mb-4 mx-2 items-center space-x-4 mt-10">
              <Text className="text-lg font-semibold text-gray-600">
                Giới tính:
              </Text>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setGender(true)}
              >
                <FontAwesome
                  name={gender ? "dot-circle-o" : "circle-o"}
                  size={24}
                  color={gender ? "#000" : "#ccc"}
                />
                <Text className="ml-3 font-semibold text-lg">Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setGender(false)}
              >
                <FontAwesome
                  name={!gender ? "dot-circle-o" : "circle-o"}
                  size={24}
                  color={!gender ? "#000" : "#ccc"}
                />
                <Text className="ml-3 font-semibold text-lg">Nữ</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="bg-[#970C1A] p-4 rounded"
              onPress={handleSubmit}
            >
              <Text className="text-center uppercase text-lg text-white font-semibold">
                Cập nhật hồ sơ
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default UpdateProfile;

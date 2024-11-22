import React, { useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment-timezone";
import { getAccountByUserId } from "@/api/profileApi";
import { setProfile } from "@/redux/slices/authSlice";

const MyProfile = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const router = useRouter();

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          if (account?.id) {
            const profileResponse = await getAccountByUserId(account.id);
            if (profileResponse.isSuccess) {
              dispatch(setProfile(profileResponse.result));
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      };

      fetchProfile();
    }, [account?.id, dispatch])
  );

  return (
    <View className="flex-1 bg-white relative">
      {/* Cover Image with White Gradient Overlay */}
      <View className="relative w-full h-32">
        <Image
          source={{
            uri: "https://png.pngtree.com/thumb_back/fh260/background/20231031/pngtree-dynamic-red-triangular-low-poly-abstract-background-image_13760781.png",
          }}
          className="w-full h-32"
        />
        <LinearGradient
          // Overlay with a gradient from transparent to white
          colors={["transparent", "rgba(255, 255, 255, 1)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%", // Adjust the height for the gradient effect
          }}
        />
      </View>

      {/* Profile Picture */}
      <View className=" ml-6 -mt-16 flex-row items-end">
        <Image
          source={{
            uri:
              account?.avatar ||
              "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
          }}
          className="w-32 h-32 rounded-full border-4 bg-white border-gray-300 shadow-lg"
          style={{
            marginTop: -5,
          }}
        />

        <View className="ml-8 max-w-[52%]">
          <Text className="text-2xl text-gray-800 uppercase font-bold ">
            {`${account?.firstName} ${account?.lastName}`}
          </Text>
          <Text className="font-medium text-base mt-2  text-[#970C1A]">
            Shipper Nhà Hàng Thiên Phú
          </Text>
          <View className="flex-row items-center mt-1">
            {account?.isVerified ? (
              <>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#4CAF50" // Green color for verified
                />
                <Text className="ml-3 text-base text-green-600 font-semibold flex-1">
                  Đã xác thực
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color="#FFC107" // Yellow color for unverified
                />
                <Text className="ml-3 text-base text-yellow-600 font-semibold flex-1">
                  Chưa xác thực
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Edit Button */}
      <View className="flex-row justify-end absolute top-1 right-1 p-5">
        <TouchableOpacity
          onPress={() => router.push("/update-profile")}
          className="p-2 border-2 border-white rounded-lg"
        >
          <MaterialCommunityIcons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View className="p-5 mt-4 mx-2">
        <View className="flex-row items-center  mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <FontAwesome name="user" size={20} color="#32cd32" />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Họ và tên
          </Text>
          <Text className="text-lg text-gray-800 font-semibold flex-2">
            {`${account?.firstName} ${account?.lastName}`}
          </Text>
        </View>
        <View className="flex-row items-center  mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <FontAwesome name="calendar" size={20} color="#1b98e0" />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Ngày sinh
          </Text>
          <Text className="text-lg text-gray-800 font-semibold flex-2">
            {moment(account?.dob).format("DD/MM/YYYY") ?? "Chưa cập nhật"}
          </Text>
        </View>
        <View className="flex-row items-center  mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <MaterialCommunityIcons name="email" size={20} color="#FFD700" />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Email
          </Text>
          <Text className="text-lg text-gray-800 font-semibold flex-2">
            {account?.email ?? "Chưa cập nhật"}
          </Text>
        </View>

        <View className="flex-row items-center  mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <MaterialCommunityIcons name="phone" size={20} color="#800080" />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Số điện thoại
          </Text>
          <Text className="text-lg text-gray-800 font-semibold flex-2">
            +84 {account?.phoneNumber ?? "Chưa cập nhật"}
          </Text>
        </View>

        <View className="flex-row  items-center  mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <MaterialCommunityIcons
              name="gender-male-female"
              size={20}
              color="#FF1493"
            />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Giới tính
          </Text>
          <Text className="text-lg text-right max-w-[60%] text-gray-800 font-semibold flex-2">
            {account?.gender ? "Nam" : "Nữ"}
          </Text>
        </View>

        <View className="flex-row   mb-6 ">
          <View className="w-10 h-10 mr-1 bg-white rounded-full items-center justify-center border border-gray-300">
            <MaterialCommunityIcons name="home" size={20} color="#FF6347" />
          </View>
          <Text className="ml-3 text-lg text-gray-500 font-semibold flex-1">
            Địa chỉ
          </Text>
          <Text className="text-lg text-right max-w-[70%] text-gray-800 font-semibold flex-2">
            {account?.address ?? "Chưa cập nhật"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MyProfile;

import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import { createSelector } from "@reduxjs/toolkit";

const WelcomeHeader: React.FC = () => {
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.auth.account);

  const selectUnreadNotifications = createSelector(
    (state: RootState) => state.notifications.notifications,
    (notifications) =>
      notifications.filter((notification) => !notification.isRead)
  );

  const selectUnreadNotificationCount = createSelector(
    selectUnreadNotifications,
    (unreadNotifications) => unreadNotifications.length
  );

  // Lấy số lượng thông báo chưa đọc
  const unreadNotificationCount = useSelector(selectUnreadNotificationCount);

  // Set avatar URL
  const avatarUri = profile?.avatar
    ? profile.avatar
    : "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1";

  // console.log("profile", profile);

  return (
    <View className="flex-row mx-2 justify-between items-center mt-4 p-4">
      <View>
        <Text className="text-lg">Xin chào,</Text>
        <Text className="font-bold text-xl">
          {`${profile?.lastName ?? ""} ${profile?.firstName ?? ""}` ||
            "Shipper"}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <IconButton icon={() => <Feather name="bell" size={32} />} />
          {unreadNotificationCount > 0 && (
            <Text className="absolute -top-1 left-0 py-1 px-2 bg-red-800 text-white font-bold rounded-full">
              {unreadNotificationCount}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/my-profile")}>
          <Avatar.Image
            size={40}
            source={{ uri: avatarUri }}
            style={{ backgroundColor: "white" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(WelcomeHeader);

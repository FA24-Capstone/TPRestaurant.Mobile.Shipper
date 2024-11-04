import React, { memo } from "react";
import { View, Text } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const WelcomeHeader: React.FC = () => {
  const profile = useSelector((state: RootState) => state.auth.account);

  // Set avatar URL
  const avatarUri = profile?.avatar
    ? profile.avatar
    : "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1";

  // console.log("profile", profile);

  return (
    <View className="flex-row mx-2 justify-between items-center p-4">
      <View>
        <Text className="text-lg">Xin chào,</Text>
        <Text className="font-bold text-xl">
          {`${profile?.lastName ?? ""} ${profile?.firstName ?? ""}` ||
            "Shipper"}
        </Text>
      </View>
      <View className="flex-row items-center">
        <IconButton icon={() => <Feather name="bell" size={24} />} />
        <Avatar.Image
          size={40}
          source={{ uri: avatarUri }}
          style={{ backgroundColor: "white" }}
        />
      </View>
    </View>
  );
};

export default memo(WelcomeHeader);

import React from "react";
import { View, Text } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

const WelcomeHeader: React.FC = () => {
  return (
    <View className="flex-row mx-2 justify-between items-center p-4">
      <View>
        <Text className="text-lg">Xin chào,</Text>
        <Text className="font-bold text-xl">Phương</Text>
      </View>
      <View className="flex-row items-center">
        <IconButton icon={() => <Feather name="bell" size={24} />} />
        <Avatar.Text size={40} label="AS" color="white" />
      </View>
    </View>
  );
};

export default WelcomeHeader;

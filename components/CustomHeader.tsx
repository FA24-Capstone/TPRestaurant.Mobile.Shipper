// /components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingBottom: 20,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="mx-4"
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center flex-1">
        <Text className="font-bold text-2xl text-gray-800 mr-6">{title}</Text>
        <View className="flex-row justify-center items-center mr-2">
          <Text className="font-semibold uppercase text-lg text-gray-600 mr-2">
            Xin chào, Khiêm
          </Text>
          <MaterialCommunityIcons
            name="hand-peace"
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

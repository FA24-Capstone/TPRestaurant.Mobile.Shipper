import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CustomHeaderDetailProps {
  title: string;
}

const CustomHeaderDetail: React.FC<CustomHeaderDetailProps> = ({ title }) => {
  const router = useRouter();

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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <View className="flex-1 items-center">
        <Text className="text-2xl font-bold text-black ">{title}</Text>
      </View>

      {/* Empty View to balance the layout */}
      <View className="w-6" />
    </View>
  );
};

export default CustomHeaderDetail;

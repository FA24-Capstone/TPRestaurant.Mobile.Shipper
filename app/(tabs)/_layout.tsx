import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import OrderDetail from "./order-detail";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";

const Tab = createBottomTabNavigator();

const Page = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header của từng tab
        tabBarActiveTintColor: Colors.primary, // Màu sắc khi tab được chọn
        tabBarLabelStyle: { fontSize: 14, marginBottom: 5 }, // Tăng kích thước chữ tab
        tabBarStyle: { height: 70 }, // Tăng chiều cao của tab bar
      }}
    >
      <Tab.Screen
        name="home-screen"
        component={require("./home-screen").default}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="order-list"
        component={require("./order-list").default}
        options={{
          tabBarLabel: "Đơn giao",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="truck-fast" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="list-dish"
        component={require("./list-dish").default}
        options={{
          tabBarLabel: "Chính sách",
          tabBarIcon: ({ color }) => (
            <Entypo name="open-book" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="setting"
        component={require("./setting").default}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={28} color={color} />
          ),
        }}
      />
      {/* Add order-detail as a screen but hide it from the tab bar */}
      <Tab.Screen
        name="order-detail"
        component={OrderDetail}
        options={{
          tabBarButton: () => null, // Hide this screen from the tab bar
          headerShown: true, // Show header for this screen
          header: () => <CustomHeaderDetail title="Chi tiết đơn hàng" />, // Custom header for order detail
          tabBarStyle: { display: "none" }, // Hide bottom tab for this screen
        }}
      />
    </Tab.Navigator>
  );
};

export default Page;

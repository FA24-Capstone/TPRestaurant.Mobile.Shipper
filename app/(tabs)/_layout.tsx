import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import OrderDetail from "./order-detail";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const Page = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for each tab
          tabBarActiveTintColor: Colors.primary, // Active tab color
          tabBarInactiveTintColor: Colors.grey, // Inactive tab color (optional)
          tabBarLabelStyle: {
            fontSize: 14,
            marginBottom: Platform.OS === "ios" ? 6 : 5, // Increased margin for iOS
          },
          tabBarStyle: {
            height: Platform.OS === "ios" ? 90 : 70, // Increased height for iOS
            paddingBottom: Platform.OS === "ios" ? 20 : 10, // Increased padding for iOS
            paddingTop: 10, // Optional: Adjust paddingTop if needed
            // Optional: Add shadow for iOS
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5, // Adds shadow on Android
          },
        }}
      >
        <Tab.Screen
          name="home-screen"
          component={require("./home-screen").default}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="home"
                size={Platform.OS === "ios" ? 24 : 28} // Reduced size for iOS
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="order-list"
          component={require("./order-list").default}
          options={{
            tabBarLabel: "Đơn giao",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="truck-fast"
                size={Platform.OS === "ios" ? 24 : 28} // Reduced size for iOS
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="list-dish"
          component={require("./list-dish").default}
          options={{
            tabBarLabel: "Chính sách",
            tabBarIcon: ({ color }) => (
              <Entypo
                name="open-book"
                size={Platform.OS === "ios" ? 24 : 28} // Reduced size for iOS
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="setting"
          component={require("./setting").default}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account"
                size={Platform.OS === "ios" ? 24 : 28} // Reduced size for iOS
                color={color}
              />
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
            header: () => <CustomHeaderDetail title="Chi tiết đơn hàng" />, // Custom header
            tabBarStyle: { display: "none" }, // Hide bottom tab for this screen
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import CustomHeaderDetail from "@/components/CustomHeaderDetail";
import { SafeAreaView } from "react-native-safe-area-context";
import OptimizeDelivery from "./optimize-delivery";
import OrderDetail from "./order-detail";
import OrderListDelivery from "./order-list";
import OrderUpload from "@/components/Pages/Order/OrderUpload";
import OrderUploaded from "./order-upload";
import MyProfile from "./my-profile";
import { useRouter } from "expo-router";
import UpdateProfile from "./update-profile";
import NotificationsScreen from "./notifications";
import OrderUploadList from "@/components/Pages/Order/OrderUploadList";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // Stack for detailed screens

const OrderStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderListDelivery"
        component={OrderListDelivery}
        options={{ headerShown: false }} // Hide header for order list
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          header: () => <CustomHeaderDetail title="Chi tiết đơn hàng" />,
        }}
      />
      <Stack.Screen
        name="OptimizeDelivery"
        component={OptimizeDelivery}
        options={{
          header: () => <CustomHeaderDetail title="Tối ưu chặng đường" />,
        }}
      />
      <Stack.Screen
        name="OrderUpload"
        component={OrderUpload}
        options={{
          header: () => <CustomHeaderDetail title="Chụp ảnh hoàn thành" />,
        }}
      />

      <Stack.Screen
        name="OrderUploadList"
        component={OrderUploadList}
        options={{
          header: () => <CustomHeaderDetail title="Chụp ảnh hoàn thành" />,
        }}
      />
    </Stack.Navigator>
  );
};

const Page = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: {
            fontSize: 14,
            marginBottom: Platform.OS === "ios" ? 6 : 5,
          },
          tabBarStyle: {
            height: Platform.OS === "ios" ? 90 : 70,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
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
          component={OrderStack} // Use the stack navigator for orders
          options={{
            tabBarLabel: "Đơn giao",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="truck-fast"
                size={Platform.OS === "ios" ? 24 : 28}
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
            tabBarLabel: "Cài đặt",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account"
                size={Platform.OS === "ios" ? 24 : 28} // Reduced size for iOS
                color={color}
              />
            ),
          }}
        />

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

        <Tab.Screen
          name="order-upload"
          component={OrderUploaded}
          options={{
            tabBarButton: () => null, // Hide this screen from the tab bar
            headerShown: true, // Show header for this screen
            header: () => <CustomHeaderDetail title="Chụp ảnh hoàn thành" />, // Custom header
            tabBarStyle: { display: "none" }, // Hide bottom tab for this screen
          }}
        />

        <Tab.Screen
          name="my-profile"
          component={MyProfile} // Use the stack navigator for orders
          options={{
            tabBarButton: () => null, // Hide this screen from the tab bar
            headerShown: true, // Show header for this screen
            header: () => (
              <CustomHeaderDetail
                title="Hồ sơ của tôi"
                onBackPress={() => router.push("/setting")}
              />
            ), // Custom header
            tabBarStyle: { display: "none" }, // Hide bottom tab for this screen
          }}
        />
        <Tab.Screen
          name="update-profile"
          component={UpdateProfile} // Use the stack navigator for orders
          options={{
            tabBarButton: () => null, // Hide this screen from the tab bar
            headerShown: true, // Show header for this screen
            header: () => (
              <CustomHeaderDetail
                title="Cập nhật hồ sơ"
                onBackPress={() => router.push("/my-profile")}
              />
            ), // Custom header
            tabBarStyle: { display: "none" }, // Hide bottom tab for this screen
          }}
        />
        <Tab.Screen
          name="notifications"
          component={NotificationsScreen} // Use the stack navigator for orders
          options={{
            tabBarButton: () => null, // Hide this screen from the tab bar
            headerShown: true, // Show header for this screen
            header: () => <CustomHeaderDetail title="Thông báo" />, // Custom header
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

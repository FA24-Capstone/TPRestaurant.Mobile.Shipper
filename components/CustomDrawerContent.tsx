// /components/CustomDrawerContent.tsx
import React from "react";
import { View, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Logo */}
      <View style={{ alignItems: "center", padding: 16 }}>
        <Image
          source={require("../assets/favicon.png")} // Replace with your logo path
          style={{ width: 40, height: 40, marginBottom: 20 }}
        />
      </View>

      {/* Menu Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

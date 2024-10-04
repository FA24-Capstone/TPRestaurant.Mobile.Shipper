import OrderUpload from "@/components/Pages/Order/OrderUpload";
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const OrderUploaded: React.FC = () => {
  return (
    <View style={styles.container}>
      <OrderUpload />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default OrderUploaded;

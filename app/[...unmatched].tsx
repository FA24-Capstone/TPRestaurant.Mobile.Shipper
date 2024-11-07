import { useNavigation } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

const Page = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>404</Text>
      <Text style={styles.messageText}>Page Not Found</Text>

      {/* Display the sad icon image */}
      <Image
        source={require("../assets/icon/iconAIsad.jpg")}
        style={styles.image}
      />

      {/* Go Back button */}
      <TouchableOpacity onPress={handleGoBack} style={styles.button}>
        <Text style={styles.buttonText}>GO BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#970C1A",
  },
  messageText: {
    fontSize: 26,
    fontWeight: "500",
    color: "#970C1A",
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginVertical: 50,
  },
  button: {
    backgroundColor: "#970C1A",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "700",
  },
});

export default Page;

import { Link, useNavigation } from "expo-router";
import React from "react";
import { View, StyleSheet, Button } from "react-native";

const Page = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Link href="/(tabs)/nature-meditate">Ready to meditate hi</Link>
      <Button title="Go Back" onPress={handleGoBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;

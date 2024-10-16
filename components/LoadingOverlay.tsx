// LoadingOverlay.tsx

import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          color="#A31927"
          style={styles.indicator}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
  },
  indicator: {
    transform: [{ scale: 1.5 }], // Increase size by scaling
  },
});

export default LoadingOverlay;

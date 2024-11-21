import { showErrorMessage } from "@/components/FlashMessageHelpers";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

interface CancelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const reasons = [
  "Khách hàng không muốn mua nữa",
  "Thời tiết quá xấu, tôi không di chuyển được",
  "Khách hàng không ở nhà",
  "Liên hệ không được với khách hàng",
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const handleSubmit = () => {
    if (selectedReason === "Khác") {
      if (otherReason.trim() === "") {
        showErrorMessage("Vui lòng nhập lý do của bạn.");
        return;
      }
      onSubmit(otherReason);
    } else if (selectedReason) {
      onSubmit(selectedReason);
    } else {
      showErrorMessage("Vui lòng chọn lý do hủy đơn.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Lý Do Hủy Đơn</Text>
          <ScrollView style={styles.scrollView}>
            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonContainer}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={styles.radioCircle}>
                  {selectedReason === reason && (
                    <View style={styles.selectedRb} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}

            {/* Option for "Other" */}
            <TouchableOpacity
              style={styles.reasonContainer}
              onPress={() => setSelectedReason("Khác")}
            >
              <View style={styles.radioCircle}>
                {selectedReason === "Khác" && (
                  <View style={styles.selectedRb} />
                )}
              </View>
              <Text style={styles.reasonText}>Khác</Text>
            </TouchableOpacity>

            {selectedReason === "Khác" && (
              <TextInput
                style={styles.textInput}
                placeholder="Vui lòng nhập lý do của bạn"
                value={otherReason}
                onChangeText={setOtherReason}
              />
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelOrderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  scrollView: {
    marginBottom: 20,
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A1011A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A1011A",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#A1011A",
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

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
  onSubmit: (reason: string, refundRequired: boolean) => void;
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
  const [refundRequired, setRefundRequired] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!selectedReason && selectedReason !== "Khác") {
      showErrorMessage("Vui lòng chọn lý do hủy đơn.");
      return;
    }

    if (selectedReason === "Khác" && otherReason.trim() === "") {
      showErrorMessage("Vui lòng nhập lý do của bạn.");
      return;
    }

    if (refundRequired === null) {
      showErrorMessage("Vui lòng chọn hoàn tiền hoặc không hoàn tiền.");
      return;
    }

    const reasonToSubmit =
      selectedReason === "Khác" ? otherReason : selectedReason;
    onSubmit(reasonToSubmit, refundRequired);
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

            {/* Refund Options */}
            <View style={styles.refundContainer}>
              <Text style={styles.subTitle}>Chọn hoàn tiền:</Text>
              <View style={styles.refundOptions}>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setRefundRequired(true)}
                >
                  <View style={styles.radioCircle}>
                    {refundRequired === true && (
                      <View style={styles.selectedRb} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Hoàn tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setRefundRequired(false)}
                >
                  <View style={styles.radioCircle}>
                    {refundRequired === false && (
                      <View style={styles.selectedRb} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Không hoàn tiền</Text>
                </TouchableOpacity>
              </View>
            </View>
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

  refundContainer: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  refundOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
});

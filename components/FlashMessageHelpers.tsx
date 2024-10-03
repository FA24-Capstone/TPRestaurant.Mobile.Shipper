// Import showMessage from react-native-flash-message
import { showMessage } from "react-native-flash-message";

// Define type for the message function parameter
type ShowMessageOption = {
  message: string;
  type: "success" | "danger";
  icon: "success" | "danger";
};

// Function to show success messages
export const showSuccessMessage = (message: string) => {
  const options: ShowMessageOption = {
    message: message,
    type: "success",
    icon: "success",
  };
  showMessage(options);
};

// Function to show error messages
export const showErrorMessage = (message: string) => {
  const options: ShowMessageOption = {
    message: message,
    type: "danger",
    icon: "danger",
  };
  showMessage(options);
};

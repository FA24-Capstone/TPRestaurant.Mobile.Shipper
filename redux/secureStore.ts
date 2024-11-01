// src/redux/secureStore.ts
import * as SecureStore from "expo-secure-store";

const secureStorage = {
  getItem: async (key: string) => {
    if (!key || typeof key !== "string") {
      console.error("SecureStore getItem error: Invalid key provided:", key);
      return null;
    }
    try {
      const result = await SecureStore.getItemAsync(key);
      return result;
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (!key || typeof key !== "string") {
      console.error("SecureStore setItem error: Invalid key provided:", key);
      return;
    }
    try {
      console.log(
        `SecureStore setItem called with key: "${key}" and value: "${value}"`
      );
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (key: string) => {
    if (!key || typeof key !== "string") {
      console.error("SecureStore removeItem error: Invalid key provided:", key);
      return;
    }
    try {
      console.log(`SecureStore removeItem called with key: "${key}"`);
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  },
};

export default secureStorage;

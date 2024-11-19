import { getAccountByUserId } from "@/api/profileApi";
import {
  deleteToken,
  enableNotification,
  getUserTokenByIp,
} from "@/api/tokenApi";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";

import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import secureStorage from "@/redux/secureStore";

const SettingScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const account = useSelector((state: RootState) => state.auth.account);

  // Get accountId from Redux state
  const token = useSelector((state: RootState) => state.auth.token);
  const [isEnableNotification, setIsEnableNotification] = useState(false);

  const fetchCurrentToken = () => async () => {
    try {
      const response = await getUserTokenByIp(token!);
      console.log("response", response);
      if (response.isSuccess) {
        const tokenData = response.result as TokenData;
        console.log("tokenData", tokenData);
        if (tokenData.deviceToken) {
          await secureStorage.setItem("device_token", tokenData.deviceToken);
          setIsEnableNotification(true);
        }
      } else {
        const errorMessage =
          response.messages?.[0] || "Failed to get user token by IP.";
        showErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Failed to fetch current token:", error);
      showErrorMessage(
        "An unexpected error occurred while fetching the user token."
      );
    }
  };

  useEffect(() => {
    fetchCurrentToken();
  }, [account]);

  // QUAN LAMMMMMMMMMMMMMMMM ===================== START

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    } else {
      showErrorMessage("Notification permissions are not enabled.");
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        await secureStorage.setItem("device_token", token);
        return token;
      }
    } catch (error) {
      console.error("Failed to get token:", error);
      showErrorMessage(
        "An error occurred while fetching the notification token."
      );
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  messaging().setBackgroundMessageHandler(async (message) => {
    console.log(message);
  });

  // QUAN LAMMMMMMMMMMMMMMMM ===================== END

  const handleChangeEnableNotification = async () => {
    try {
      setIsEnableNotification(!isEnableNotification);
      let deviceToken = await secureStorage.getItem("device_token");
      const response = await enableNotification(
        token!,
        isEnableNotification ? undefined : deviceToken!
      );
      console.log(`enableNotification response`, response);
      if (response.isSuccess) {
        showSuccessMessage("Notification settings updated successfully.");
        await fetchCurrentToken();
      } else {
        const errorMessage =
          response.messages?.[0] || "Failed to update notification settings.";
        showErrorMessage(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Failed to change notification settings:", error);
      showErrorMessage(
        "An unexpected error occurred while updating notification settings."
      );
    }
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn đăng xuất không?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng Xuất  ",
        style: "destructive",
        onPress: async () => {
          let token = await secureStorage.getItem("token");
          console.log("hehehe", token);
          if (token) {
            const response = await getUserTokenByIp(token);
            console.log("hehehe2", response);
            if (response.isSuccess) {
              const tokenData = response.result as TokenData;
              await deleteToken(tokenData.tokenId);
              await secureStorage.removeItem("token");
              await secureStorage.removeItem("refreshToken");
              dispatch(logout());
            } else {
              await secureStorage.removeItem("token");
              await secureStorage.removeItem("refreshToken");
              dispatch(logout());
            }
          }
          router.replace("/login");
          showSuccessMessage("Đăng xuất thành công!");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            router.push("/my-profile");
          }}
        >
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={{
                uri:
                  account?.avatar ||
                  "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
              }}
              style={styles.profileAvatar}
            />

            <TouchableOpacity
              onPress={() => {
                router.push("/my-profile");
              }}
            >
              <View style={styles.profileAction}>
                <MaterialCommunityIcons color="white" name="pencil" size={15} />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View>
          <Text
            style={styles.profileName}
          >{`${account?.firstName} ${account?.lastName}`}</Text>
          <Text className="font-medium text-lg mt-2 text-center text-[#970C1A]">
            Shipper Nhà Hàng Thiên Phú
          </Text>
          <Text style={styles.profileAddress}>
            +84 {account?.phoneNumber || "Địa chỉ chưa được cập nhật"}
          </Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuỳ Chọn</Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/my-profile");
            }}
            style={styles.row}
          >
            <View style={[styles.rowIcon, { backgroundColor: "#970C1A" }]}>
              <MaterialCommunityIcons color="white" name="account" size={20} />
            </View>
            <Text style={styles.rowLabel}>Hồ sơ của tôi</Text>
            <View style={styles.rowSpacer} />
            <MaterialCommunityIcons
              color="#C6C6C6"
              name="chevron-right"
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push("/list-dish");
            }}
            style={styles.row}
          >
            <View style={[styles.rowIcon, { backgroundColor: "#EDAA16" }]}>
              <Entypo
                name="book"
                size={20} // Reduced size for iOS
                color="white"
              />
            </View>
            <Text style={styles.rowLabel}>Chính sách giao hàng</Text>
            <View style={styles.rowSpacer} />
            <MaterialCommunityIcons
              color="#C6C6C6"
              name="chevron-right"
              size={20}
            />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: "#38C959" }]}>
              <MaterialCommunityIcons color="#fff" name="bell" size={20} />
            </View>
            <Text style={styles.rowLabel}>Nhận thông báo</Text>
            <View style={styles.rowSpacer} />
            <Switch
              onValueChange={async () => await handleChangeEnableNotification()}
              value={isEnableNotification}
            />
          </View>
        </View>

        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Tài Nguyên</Text>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}
          >
            <View style={[styles.rowIcon, { backgroundColor: "#8e8d91" }]}>
              <MaterialCommunityIcons color="#fff" name="flag" size={20} />
            </View>
            <Text style={styles.rowLabel}>Giải đáp</Text>
            <View style={styles.rowSpacer} />
            <MaterialCommunityIcons
              color="#C6C6C6"
              name="chevron-right"
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}
          >
            <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
              <MaterialCommunityIcons
                color="#fff"
                name="email-send"
                size={20}
              />
            </View>
            <Text style={styles.rowLabel}>Liên hệ chúng tôi</Text>
            <View style={styles.rowSpacer} />
            <MaterialCommunityIcons
              color="#C6C6C6"
              name="chevron-right"
              size={20}
            />
          </TouchableOpacity> */}
          {/* Logout Button */}
          <TouchableOpacity
            className="bg-white border-[#A1011A] border-2 py-3 rounded-lg my-4"
            onPress={handleLogout}
          >
            <Text className="text-[#A1011A] uppercase text-center font-semibold text-lg">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /** Profile */
  profile: {
    marginTop: 44,
    padding: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAvatar: {
    width: 150,
    height: 150,
    borderRadius: 9999,
    borderColor: "#f2f2f2",
    borderWidth: 3,
    shadowColor: "#000",
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#970C1A",
  },
  profileName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 19,
    color: "#989898",
    textAlign: "center",
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});

export default SettingScreen;

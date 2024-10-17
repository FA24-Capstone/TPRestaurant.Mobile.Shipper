import { getAccountByUserId } from "@/api/profileApi";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";

const SettingScreen: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const userId = "584adfc1-b3d2-4aee-b2ee-e9007aca08c5";
        const response = await getAccountByUserId(userId);
        if (response && response.isSuccess) {
          const { firstName, lastName, email, phoneNumber, avatar } =
            response.result;
          setUser({
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            email: email ?? "",
            phoneNumber: phoneNumber ?? "",
            avatar: avatar ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch account data:", error);
      }
    };
    fetchAccount();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
        >
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={{
                uri:
                  user.avatar ||
                  "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
              }}
              style={styles.profileAvatar}
            />

            <TouchableOpacity
              onPress={() => {
                // handle onPress
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
          >{`${user.firstName} ${user.lastName}`}</Text>
          <Text className="font-medium text-lg mt-2 text-center text-[#970C1A]">
            Shipper Nhà Hàng Thiên Phú
          </Text>
          <Text style={styles.profileAddress}>
            +84 {user.phoneNumber || "Địa chỉ chưa được cập nhật"}
          </Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
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
              onValueChange={(pushNotifications) =>
                setForm({ ...form, pushNotifications })
              }
              value={form.pushNotifications}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

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
    borderColor: "#7F7F7F",
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

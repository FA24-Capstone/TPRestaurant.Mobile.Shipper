import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import {
  getNotificationsByUserId,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notificationApi"; // Đường dẫn đến file API
import { NotificationItem } from "@/app/types/notification_type";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment-timezone";

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const account = useSelector((state: RootState) => state.auth.account);
  const [modalVisible, setModalVisible] = useState(false); // State để hiển thị modal xác nhận
  const [loadingMark, setLoadingMark] = useState(false); // State để hiển thị trạng thái loading

  // Hàm tải lại thông báo
  const fetchNotifications = async () => {
    setLoading(true);
    if (account && account.id) {
      try {
        const response = await getNotificationsByUserId(account?.id);

        if (response.isSuccess) {
          setNotifications(response.result.items); // Lấy danh sách thông báo từ API
        } else {
          showErrorMessage(
            "Failed to fetch notifications: " + response.messages
          );
          console.error("Failed to fetch notifications:", response.messages);
        }
      } catch (error) {
        showErrorMessage("Error fetching notifications: " + error);
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      showErrorMessage("Tài khoản không tồn tại");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleReadAll = () => {
    setModalVisible(true);
  };

  // Hàm xử lý khi nhấn vào một thông báo
  const handleNotificationClick = async (item: NotificationItem) => {
    if (item.isRead) {
      showSuccessMessage("Bạn đã đọc thông báo này rồi!");
      return;
    }

    try {
      const response = await markNotificationAsRead(item.notificationId);
      if (response.isSuccess) {
        showSuccessMessage("Đã đánh dấu thông báo là đã đọc.");
        fetchNotifications(); // Tải lại danh sách thông báo
      } else {
        showErrorMessage("Lỗi khi đánh dấu thông báo: " + response.messages);
      }
    } catch (error) {
      showErrorMessage("Error marking notification as read: " + error);
    }
  };

  // Hàm xử lý khi nhấn "Đọc tất cả"
  const handleConfirmReadAll = async () => {
    setLoadingMark(true);
    setModalVisible(false);

    try {
      if (account?.id) {
        const response = await markAllNotificationsAsRead(account.id);

        if (response.isSuccess) {
          showSuccessMessage("Tất cả thông báo đã được đánh dấu là đã đọc.");
          fetchNotifications(); // Tải lại danh sách thông báo
        } else {
          showErrorMessage(
            "Lỗi khi đánh dấu tất cả thông báo: " + response.messages
          );
        }
      } else {
        showErrorMessage("Tài khoản không tồn tại");
      }
    } catch (error) {
      showErrorMessage("Error marking all notifications as read: " + error);
    } finally {
      setLoadingMark(false);
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      className={`px-4 py-4   border-2 my-1 mx-2 rounded-md relative ${
        item.isRead === true
          ? "bg-white border-gray-200"
          : "bg-[#FF8787]/20 border-[#FF8787]/20"
      } `}
      onPress={() => handleNotificationClick(item)}
    >
      {item.isRead === false ? (
        <View className="absolute top-3 right-3">
          <FontAwesome name="circle" size={14} color="#D80000" />
        </View>
      ) : (
        <View className="absolute top-4 right-4">
          <FontAwesome name="check" size={18} color="green" />
        </View>
      )}
      <Text className="text-xs text-gray-700 font-semibold">
        {moment.utc(item.notifyTime).local().format("hh:mm A, DD/MM/YYYY") ||
          "Không xác định"}
      </Text>
      <Text className="text-lg font-bold text-gray-700">
        {item.notificationName}
      </Text>
      <Text className="text-sm text-gray-600">{item.messages}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-500">
          No notifications available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-2 py-2 bg-white">
      <TouchableOpacity
        className="flex-row justify-end"
        onPress={handleReadAll}
      >
        <Text className=" w-[100px] underline py-2 text-lg font-semibold italic text-red-600">
          Đọc tất cả
        </Text>
      </TouchableOpacity>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.notificationId}
      />

      {/* Modal xác nhận */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="items-center justify-center flex-1 bg-opacity-50 bg-black/50">
          <View className="w-3/4 p-4 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-semibold text-center">
              Bạn có chắc chắn đánh dấu tất cả thông báo là đã đọc?{" "}
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 w-[45%] bg-gray-300 rounded "
              >
                <Text className="font-semibold text-center uppercase">Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmReadAll}
                disabled={loadingMark}
                className={`px-4 py-2 w-[45%] bg-blue-500 rounded ${
                  loadingMark ? "bg-gray-500" : "bg-blue-500"
                }`}
              >
                <Text className="font-semibold text-center text-white uppercase">
                  {loadingMark ? "Xác nhận..." : "Đúng vậy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationsScreen;
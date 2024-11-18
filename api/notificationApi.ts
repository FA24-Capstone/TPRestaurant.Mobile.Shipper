import { AppActionResult } from "@/app/types/app_action_result_type";
import apiClient from "./config";
import { NotificationDataReponse } from "@/app/types/notification_type";

export const getNotificationsByUserId = async (
  accountId: string
): Promise<AppActionResult<NotificationDataReponse>> => {
  const response = await apiClient.get<
    AppActionResult<NotificationDataReponse>
  >(`/notification/get-all-notification-by-account-id/${accountId}`);

  return response.data;
};

export const markAllNotificationsAsRead = async (
  accountId: string
): Promise<AppActionResult<NotificationDataReponse>> => {
  const response = await apiClient.post<
    AppActionResult<NotificationDataReponse>
  >(`/notification/mark-all-as-read/${accountId}`);
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<AppActionResult<null>> => {
  const response = await apiClient.post<AppActionResult<null>>(
    `/notification/mark-as-read/${notificationId}`
  );
  return response.data;
};

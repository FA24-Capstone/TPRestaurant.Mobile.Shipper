export interface NotificationDataReponse {
  items: NotificationItem[];
  totalPages: number;
}

export interface NotificationItem {
  notificationId: string;
  notificationName: string;
  messages: string;
  notifyTime: string;
  isRead: boolean;
  accountId: string;
  account: any;
}

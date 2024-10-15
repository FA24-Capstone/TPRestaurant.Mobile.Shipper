import { Account, Order } from "@/app/types/order_type";
import React from "react";
import { View, Text } from "react-native";
import { Avatar, Badge } from "react-native-paper";

interface CustomerInfoProps {
  customerData: Order;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customerData }) => {
  console.log("customerData", customerData);

  const statusMapping = {
    6: { colorClass: "bg-cyan-800", text: "Sẵn sàng giao hàng" },
    7: { colorClass: "bg-[#FFA500]", text: "Đơn chờ giao" },
    8: { colorClass: "bg-[#00BFFF]", text: "Đang giao hàng" },
    9: { colorClass: "bg-[#32CD32]", text: "Đã hoàn thành" },
    10: { colorClass: "bg-[#FF0000]", text: "Đã hủy" },
  };

  const getStatusInfo = (statusId: keyof typeof statusMapping) => {
    return (
      statusMapping[statusId] || {
        colorClass: "bg-gray-800",
        text: "Không xác định",
      }
    );
  };

  const statusInfo = getStatusInfo(
    customerData?.statusId as 6 | 7 | 8 | 9 | 10
  );

  return (
    <View className="flex-row items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
      <View className="flex-row items-center">
        <Avatar.Text
          size={60}
          label={`${customerData?.account?.firstName?.slice(0, 1) || ""}${
            customerData?.account?.lastName?.slice(0, 1) || ""
          }`} // Sử dụng ký tự đầu của tên và họ
        />
        <View className="ml-4">
          <Text className="text-xl font-bold">
            {customerData?.account?.lastName} {customerData?.account?.firstName}
          </Text>
          <Text className="text-gray-500 text-base">Khách quen</Text>
        </View>
      </View>
      <View>
        <Text className="text-[#A1011A] font-semibold text-center text-lg mb-2">
          {customerData?.totalDistance || "0km"}
        </Text>
        <View className={` p-2 rounded-md ${statusInfo.colorClass}`}>
          <Text className="text-center text-white font-semibold">
            {statusInfo.text || "không xác định"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomerInfo;

import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LineDelivery: React.FC = () => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="font-medium text-lg text-gray-700 mb-4">
          Mã đơn Order:
          <Text className="text-[#C01D2E] font-semibold"> #351</Text>
        </Text>
        <Text className="text-blue-500  text-lg italic font-medium">
          Xem bản đồ
        </Text>
      </View>

      <View className="p-4 border-2 border-zinc-200 rounded-md">
        <Text className="text-gray-600 ">
          <Text className="font-semibold text-gray-800">11:00 AM,</Text>
          {""}
          27/09/2024 (Hôm nay)
        </Text>
        <View className="flex-row mt-2 items-center  my-3">
          <Text className=" my-1 text-red-500 font-bold text-lg">20p</Text>
          <View className="ml-4">
            <Image
              source={require("../../../../assets/icon/lineplace.png")}
              style={{ width: 12, height: 109, borderRadius: 8 }}
            />
          </View>

          <View className="ml-4 w-[80%]">
            <Text className=" text-gray-400 font-semibold">
              Từ (Nhà hàng Thiên Phú)
            </Text>
            <Text className=" text-gray-700 text-base font-semibold ">
              78 Đường Lý Tự Trọng, Phường 2, Thành phố Đà Lạt, Lâm Đồng 66109
            </Text>

            <Text className=" text-gray-400 font-semibold mt-6">Đến</Text>
            <Text className=" text-gray-700 text-base font-semibold">
              S6.06 Vinhomes Grand Park, TP Thủ Đức, TP Hồ Chí Minh
            </Text>
          </View>
        </View>
        <Text className="text-gray-600 ">
          <Text className="font-semibold text-gray-800">11:20 AM, </Text> {""}
          27/09/2024 (Hôm nay)
        </Text>
      </View>
    </View>
  );
};

export default LineDelivery;

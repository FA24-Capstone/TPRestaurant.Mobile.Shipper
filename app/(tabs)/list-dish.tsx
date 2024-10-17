import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ShippingPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row gap-1"
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#9A0E1D" />
          <MaterialCommunityIcons name="home" size={30} color="#9A0E1D" />
        </TouchableOpacity>
      </View>
      <ScrollView className="px-6 ">
        <View className="text-center mb-4">
          <Text className="text-xl font-extrabold text-gray-800 uppercase text-center">
            Chính sách giao hàng
          </Text>
          <Text className="text-lg font-extrabold text-[#9A0E1D] uppercase text-center">
            Nhà hàng Thiên Phú
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">1. Mục Đích:</Text>
          <Text className="text-base text-gray-800 mt-2">
            Chính sách này quy định quyền và trách nhiệm của shipper trong quá
            trình nhận đơn hàng, giao hàng, và đảm bảo chất lượng dịch vụ giao
            nhận của Nhà hàng Thiên Phú.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">2. Quy Trình Giao Hàng:</Text>
          <Text className="text-base text-gray-800 mt-2">
            • Nhận đơn hàng: Shipper phải kiểm tra và xác nhận thông tin đơn
            hàng trên ứng dụng trước khi đến nhận hàng tại nhà hàng.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Thời gian nhận hàng: Shipper cần đến nhận hàng trong vòng 15 phút
            kể từ khi nhận thông báo sẵn sàng giao hàng từ hệ thống.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Giao hàng: Shipper phải giao hàng đúng địa chỉ, không thay đổi
            hoặc di chuyển hàng hóa đến các địa điểm khác ngoài đơn hàng được
            chỉ định.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Thời gian giao hàng: Tùy thuộc vào khoảng cách, thời gian giao
            hàng không được vượt quá 30 phút kể từ khi nhận hàng từ nhà hàng.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">3. Trách Nhiệm Của Shipper:</Text>
          <Text className="text-base text-gray-800 mt-2">
            • Kiểm tra đơn hàng: Trước khi nhận hàng, shipper phải kiểm tra kỹ
            lưỡng các món ăn, số lượng, và tình trạng đóng gói để đảm bảo chất
            lượng tốt nhất khi giao tới khách hàng.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • An toàn giao thông: Shipper phải tuân thủ luật lệ giao thông, đảm
            bảo an toàn trong quá trình di chuyển và không gây ảnh hưởng đến
            chất lượng của món ăn.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Bảo mật thông tin: Shipper phải giữ bí mật thông tin cá nhân và
            địa chỉ của khách hàng, không chia sẻ cho bên thứ ba.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">4. Quyền Lợi Của Shipper:</Text>
          <Text className="text-base text-gray-800 mt-2">
            • Hỗ trợ từ nhà hàng: Trong trường hợp gặp sự cố (hỏng hóc, mất mát
            hàng hóa) hoặc giao hàng muộn vì lý do khách quan, shipper sẽ được
            hỗ trợ bởi bộ phận chăm sóc khách hàng của nhà hàng.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Phần thưởng: Shipper có thể nhận được các phần thưởng và tiền
            thưởng dựa trên hiệu suất giao hàng (giao hàng đúng thời gian, tỷ lệ
            hài lòng khách hàng cao).
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Phí giao hàng: Mức phí giao hàng sẽ được xác định dựa trên khoảng
            cách và mức giá đã được quy định trong hệ thống ứng dụng shipper.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">5. Hình Thức Xử Lý Vi Phạm:</Text>
          <Text className="text-base text-gray-800 mt-2">
            • Giao hàng muộn: Nếu shipper giao hàng muộn quá 15 phút so với thời
            gian dự kiến mà không có lý do hợp lý, shipper sẽ bị phạt tiền hoặc
            trừ vào tiền thưởng hàng tháng.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Làm hỏng hàng hóa: Nếu shipper làm hỏng hoặc làm mất món ăn trong
            quá trình vận chuyển, shipper phải chịu trách nhiệm bồi thường toàn
            bộ giá trị đơn hàng.
          </Text>
          <Text className="text-base text-gray-800 mt-2">
            • Vi phạm đạo đức: Các hành vi như lừa dối, ăn cắp, hoặc làm sai
            lệch thông tin giao hàng sẽ bị xử lý nghiêm khắc, bao gồm cả việc
            chấm dứt hợp đồng và phạt tiền.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">6. Quy Định Bảo Hiểm:</Text>
          <Text className="text-base text-gray-800 mt-2">
            Shipper sẽ được hưởng chế độ bảo hiểm tai nạn trong quá trình làm
            việc theo quy định của công ty. Mọi tai nạn xảy ra trong giờ làm
            việc đều được báo cáo và xử lý theo quy định pháp luật.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-bold">7. Cam Kết:</Text>
          <Text className="text-base text-gray-800 mt-2">
            Bằng việc tham gia vào hệ thống giao hàng của Nhà hàng Thiên Phú,
            shipper cam kết tuân thủ các điều khoản và quy định trên. Bất kỳ vi
            phạm nào sẽ bị xử lý theo đúng quy định của chính sách này.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShippingPolicyScreen;

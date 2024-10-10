import { OrderDish } from "@/app/types/order_type";
import React from "react";
import { View, Text, Image } from "react-native";

interface Dish {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: any; // You can use the `require` function for static images
}
interface OrderDishesProps {
  dishes: OrderDish[];
}

const OrderDishes: React.FC<OrderDishesProps> = ({ dishes }) => {
  // Fake data for dishes
  // const dishes: Dish[] = [
  //   {
  //     id: "1",
  //     name: "Bánh nhân tôm",
  //     price: "70.000 VND",
  //     quantity: 1,
  //     image: require("../../../../assets/item/dish.png"),
  //   },
  //   {
  //     id: "2",
  //     name: "Cơm chiên dương châu",
  //     price: "50.000 VND",
  //     quantity: 2,
  //     image: require("../../../../assets/item/dish.png"),
  //   },
  //   {
  //     id: "3",
  //     name: "Phở bò đặc biệt",
  //     price: "60.000 VND",
  //     quantity: 1,
  //     image: require("../../../../assets/item/dish.png"),
  //   },
  // ];

  return (
    <View className="mb-6">
      <Text className="font-semibold text-base text-gray-700">
        Danh sách món
      </Text>

      {/* Loop through the list of dishes */}
      {dishes.map((dish, index) => (
        <View
          key={dish.orderDetailsId}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg my-2"
        >
          <Text className="font-semibold text-base text-gray-700 mr-3">
            #{index + 1}
          </Text>
          <Image
            source={
              dish.dishSizeDetail?.dish.image
                ? { uri: dish.dishSizeDetail.dish.image }
                : dish.comboDish?.combo.image
                ? { uri: dish.comboDish.combo.image }
                : {
                    uri: "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-1-580x440.png",
                  }
            } // Dynamic image from the dish object
            className="w-12 h-12 rounded-lg"
          />
          <View className="ml-4 flex-1 w-[70%]">
            <Text className="text-gray-700 font-semibold text-base">
              {dish.comboDish?.combo.name || dish.dishSizeDetail?.dish.name}
            </Text>
            <Text className="text-gray-600">
              {dish.comboDish?.combo.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) ||
                dish.dishSizeDetail?.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
            </Text>
          </View>
          <View className="w-[30%] gap-1">
            <Text className="text-gray-500 text-center font-medium">
              Số lượng:
            </Text>
            <Text className="text-gray-600 text-center text-base font-semibold">
              {dish.quantity}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default OrderDishes;

import React from "react";
import { View, Text, Image } from "react-native";

interface Dish {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: any; // You can use the `require` function for static images
}

const OrderDishes: React.FC = () => {
  // Fake data for dishes
  const dishes: Dish[] = [
    {
      id: "1",
      name: "Bánh nhân tôm",
      price: "70.000 VND",
      quantity: 1,
      image: require("../../../../assets/item/dish.png"),
    },
    {
      id: "2",
      name: "Cơm chiên dương châu",
      price: "50.000 VND",
      quantity: 2,
      image: require("../../../../assets/item/dish.png"),
    },
    {
      id: "3",
      name: "Phở bò đặc biệt",
      price: "60.000 VND",
      quantity: 1,
      image: require("../../../../assets/item/dish.png"),
    },
  ];

  return (
    <View className="mb-6">
      <Text className="font-semibold text-base text-gray-700">
        Danh sách món <Text className="text-[#C01D2E]">#351</Text>
      </Text>

      {/* Loop through the list of dishes */}
      {dishes.map((dish, index) => (
        <View
          key={dish.id}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg my-2"
        >
          <Text className="font-semibold text-base text-gray-700 mr-3">
            #{index + 1}
          </Text>
          <Image
            source={dish.image} // Dynamic image from the dish object
            className="w-12 h-12 rounded-lg"
          />
          <View className="ml-4 flex-1 w-[70%]">
            <Text className="text-gray-700 font-semibold text-base">
              {dish.name}
            </Text>
            <Text className="text-gray-600">{dish.price}</Text>
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

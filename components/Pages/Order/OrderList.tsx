import { Order } from "@/app/types/order_type";
import OrderItem from "@/components/Pages/Order/OrderItem";
import React from "react";
import { View, Text, ScrollView } from "react-native";

interface OrderListProps {
  orders: Order[];
  limit?: number; // Prop mới, có thể không bắt buộc
  selectedOrders?: string[];
  onSelectOrder?: (orderId: string) => void;
  isPending?: boolean; // Prop mới để kiểm tra trạng thái "pending"
  onViewDetail?: (orderId: string) => void; // Cập nhật kiểu
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  limit,
  selectedOrders,
  onSelectOrder,
  isPending,
  onViewDetail,
}) => {
  // Nếu có limit, chỉ hiển thị số đơn hàng giới hạn, ngược lại hiển thị toàn bộ
  const displayedOrders = limit ? orders.slice(0, limit) : orders;

  return (
    <ScrollView className="px-2 ">
      {displayedOrders.map((order, index) => (
        <OrderItem
          key={order.id}
          order={order}
          selected={selectedOrders?.includes(order.id) ?? false} // Kiểm tra xem đơn hàng có được chọn không
          onSelect={onSelectOrder ?? (() => {})} // Hàm xử lý khi chọn/bỏ chọn
          isPending={isPending} // Truyền thêm isPending để OrderItem biết có checkbox hay không
          onViewDetail={onViewDetail}
        />
      ))}
    </ScrollView>
  );
};

export default OrderList;

export interface Order {
  id: string;
  time: string;
  address: string;
  distance: string;
  status: string;
}

export interface OrderItemProps {
  order: Order;
  selected: boolean;
  onSelect: (orderId: string) => void;
  isPending?: boolean;
  onViewDetail: () => void;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  remark?: string;
}

export interface OrderItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  remark?: string;
  toAdd?: boolean;
}

export interface Order {
  id: string;
  tableNo: string;
  orderType: 'dine-in' | 'take-away' | 'door-delivery' | 'online';
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled' | 'bill-printed';
  createdAt: Date;
  customerName?: string;
  customerNumber?: string;
  customerAddress?: string;
  customerGSTIN?: string;
  paymentMode?: string;
  discount?: number;
  charges?: number;
  tipAmount?: number;
}

export interface Table {
  id: number;
  name: string;
  section: string;
  status: 'available' | 'occupied' | 'bill-printed';
  orderId?: string;
  timer?: number; // seconds elapsed
}

export type OrderType = 'dine-in' | 'take-away' | 'door-delivery' | 'online' | 'pending';
export type ViewType = 'pos' | 'tables' | 'pending' | 'dashboard' | 'bill';

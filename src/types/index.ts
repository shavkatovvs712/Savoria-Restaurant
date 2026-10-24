export type Category = 
  | 'all'
  | 'national'
  | 'kebabs'
  | 'steaks'
  | 'soups'
  | 'salads'
  | 'desserts'
  | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number; // in UZS
  description: string;
  image: string;
  weight: string; // e.g. "350g"
  prepTime: string; // e.g. "20-25 daq"
  rating: number;
  reviewCount: number;
  ingredients: string[];
  isSpicy?: boolean;
  isPopular?: boolean;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  menuItemId?: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export type OrderStatus = 
  | 'pending_cashier' // Ofitsiant buyurtma oldi, kassaga yubordi (Kassa tasdiqlashi kutilmoqda)
  | 'new'             // Yangi buyurtma
  | 'cooking'         // Kassa tasdiqlab oshxonaga yubordi (Pishirilmoqda)
  | 'ready'           // Oshxona tayyorladi
  | 'delivering'      // Kuryer yetkazmoqda (GPS faol)
  | 'completed'       // Kassada to'landi va chek berildi
  | 'cancelled';      // Bekor qilingan

export type OrderType = 'dine_in' | 'delivery' | 'takeaway';

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export type PaymentMethod = 'cash' | 'click' | 'payme' | 'uzum' | 'card';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SOFRA-8491"
  type: OrderType;
  tableNumber?: number;
  waiterId?: string;
  waiterName?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  courierId?: string;
  courierName?: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number; // usually 10% for dine-in, 0% for delivery
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  cashGiven?: number; // Mijoz bergan naqd summa
  changeDue?: number; // Kassadan qaytarilgan qaytim
  isPaid: boolean;
  createdAt: string;
  sentToKitchenAt?: string;
  completedAt?: string;
  deliveryCoords?: { lat: number; lng: number; distanceKm: number; etaMinutes: number };
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  zone: 'main' | 'terrace' | 'vip';
  status: 'available' | 'pending_cashier' | 'occupied' | 'cooking' | 'bill_requested';
  activeOrderId?: string;
  waiterId?: string;
  waiterName?: string;
}

export interface CourierGpsInfo {
  lat: number;
  lng: number;
  district: string;
  speedKmH: number;
  batteryPercent: number;
  isMoving: boolean;
  lastUpdated: string;
}

export interface Waiter {
  id: string;
  name: string;
  phone: string;
  pin: string; // 4-digit PIN
  status: 'active' | 'break' | 'offline';
  todaySales: number;
  todayTips: number;
  ordersCount: number;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: 'car' | 'scooter' | 'bike';
  status: 'available' | 'busy' | 'offline';
  activeOrdersCount: number;
  completedOrdersCount: number;
  gps?: CourierGpsInfo;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  guestsCount: number;
  date: string;
  time: string;
  zone: 'main' | 'terrace' | 'vip';
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export type AppMode = 'customer' | 'admin' | 'waiter' | 'kitchen';

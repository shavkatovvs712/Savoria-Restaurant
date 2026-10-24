import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  Order,
  OrderStatus,
  Table,
  Waiter,
  Courier,
  Reservation,
  Review,
  AppMode,
  OrderItem,
  PaymentMethod
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_WAITERS,
  INITIAL_COURIERS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_REVIEWS
} from '../data/initialData';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface RestaurantContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Menyu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  toggleDishAvailability: (id: string) => void;
  deleteMenuItem: (id: string) => void;

  // Buyurtmalar
  orders: Order[];
  createOrder: (orderData: Partial<Order> & { items: OrderItem[] }) => Order;
  sendOrderToCashier: (orderData: Partial<Order> & { items: OrderItem[] }) => Order;
  approveAndSendToKitchenFromCashier: (orderId: string) => void;
  processCashierPayment: (orderId: string, paymentMethod: PaymentMethod, cashGiven?: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignCourier: (orderId: string, courierId: string) => void;
  payAndCloseOrder: (orderId: string, paymentMethod: PaymentMethod) => void;

  // Stollar
  tables: Table[];
  addTable: (tableData: { number: number; seats: number; zone: Table['zone'] }) => void;
  deleteTable: (tableNumber: number) => void;
  updateTable: (tableNumber: number, data: Partial<Table>) => void;
  updateTableStatus: (
    tableNumber: number,
    status: Table['status'],
    activeOrderId?: string,
    waiterId?: string,
    waiterName?: string
  ) => void;

  // Ofitsiantlar
  waiters: Waiter[];
  currentWaiter: Waiter | null;
  loginWaiter: (pin: string) => boolean;
  logoutWaiter: () => void;
  addWaiter: (waiter: Omit<Waiter, 'id' | 'todaySales' | 'todayTips' | 'ordersCount'>) => void;
  updateWaiter: (id: string, waiter: Partial<Waiter>) => void;
  deleteWaiter: (id: string) => void;

  // Kuryerlar & GPS
  couriers: Courier[];
  addCourier: (courier: Omit<Courier, 'id' | 'activeOrdersCount' | 'completedOrdersCount'>) => void;
  updateCourier: (id: string, courier: Partial<Courier>) => void;
  deleteCourier: (id: string) => void;
  simulateCourierGps: () => void;

  // Bronlar
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  // Sharhlar
  reviews: Review[];
  addReview: (rev: Omit<Review, 'id' | 'date'>) => void;

  // Savatcha (Mijoz uchun)
  cart: OrderItem[];
  addToCart: (dish: MenuItem, quantity?: number, note?: string) => void;
  updateCartItemQty: (dishId: string, delta: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;

  // Chek modali (Faqat kassa beradi)
  activeReceiptOrder: Order | null;
  openReceiptModal: (order: Order) => void;
  closeReceiptModal: () => void;

  // Admin
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Xabarnoma / Tovush
  notification: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  playSound: (type: 'order' | 'ready' | 'click') => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEY = 'sofra_restaurant_data_v5';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('customer');

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [tables, setTables] = useState<Table[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tables`);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const [waiters, setWaiters] = useState<Waiter[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_waiters`);
      return saved ? JSON.parse(saved) : INITIAL_WAITERS;
    } catch {
      return INITIAL_WAITERS;
    }
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_couriers`);
      return saved ? JSON.parse(saved) : INITIAL_COURIERS;
    } catch {
      return INITIAL_COURIERS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentWaiter, setCurrentWaiter] = useState<Waiter | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sofra_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<ToastNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_tables`, JSON.stringify(tables));
      localStorage.setItem(`${STORAGE_KEY}_waiters`, JSON.stringify(waiters));
      localStorage.setItem(`${STORAGE_KEY}_couriers`, JSON.stringify(couriers));
      localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [menuItems, orders, tables, waiters, couriers, reservations, reviews]);

  const playSound = (type: 'order' | 'ready' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'order') {
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'ready') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
    if (type === 'success') playSound('order');
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // --- STOLLAR BOSHQARUVI (Stol qo'shish, o'chirish) ---
  const addTable = (tableData: { number: number; seats: number; zone: Table['zone'] }) => {
    // Check if table number already exists
    if (tables.some((t) => t.number === tableData.number)) {
      showToast(`Stol №${tableData.number} allaqachon mavjud!`, 'warning');
      return;
    }

    const newTable: Table = {
      id: Date.now(),
      number: tableData.number,
      seats: tableData.seats,
      zone: tableData.zone,
      status: 'available',
    };

    setTables((prev) => [...prev, newTable].sort((a, b) => a.number - b.number));
    showToast(`Yangi Stol №${newTable.number} muvaffaqiyatli qo‘shildi!`, 'success');
  };

  const deleteTable = (tableNumber: number) => {
    const target = tables.find((t) => t.number === tableNumber);
    if (target?.status !== 'available') {
      showToast('Band bo‘lgan stolni o‘chirib bo‘lmaydi!', 'warning');
      return;
    }
    setTables((prev) => prev.filter((t) => t.number !== tableNumber));
    showToast(`Stol №${tableNumber} o‘chirildi.`, 'info');
  };

  const updateTable = (tableNumber: number, data: Partial<Table>) => {
    setTables((prev) =>
      prev.map((t) => (t.number === tableNumber ? { ...t, ...data } : t))
    );
  };

  const updateTableStatus = (
    tableNumber: number,
    status: Table['status'],
    activeOrderId?: string,
    waiterId?: string,
    waiterName?: string
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.number === tableNumber) {
          return {
            ...t,
            status,
            activeOrderId: activeOrderId !== undefined ? activeOrderId : t.activeOrderId,
            waiterId: waiterId !== undefined ? waiterId : t.waiterId,
            waiterName: waiterName !== undefined ? waiterName : t.waiterName,
          };
        }
        return t;
      })
    );
  };

  // --- BUYURTMALAR & OFITSIANT -> KASSA -> OSHXONA ZANJIRI ---
  
  // 1. OFITSIANT FAQAT BUYURTMA OLIB KASSAGA YUBORADI
  const sendOrderToCashier = (orderData: Partial<Order> & { items: OrderItem[] }): Order => {
    const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = orderData.type === 'dine_in' ? Math.round(subtotal * 0.1) : 0;
    const deliveryFee = orderData.type === 'delivery' ? 20000 : 0;
    const total = subtotal + serviceFee + deliveryFee;

    const newOrder: Order = {
      id: orderData.id || `order-${Date.now()}`,
      orderNumber: orderData.orderNumber || `SAVORIA-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderData.type || 'dine_in',
      tableNumber: orderData.tableNumber,
      waiterId: orderData.waiterId,
      waiterName: orderData.waiterName,
      customerName: orderData.customerName || `Stol ${orderData.tableNumber || ''} Mehmonlari`,
      customerPhone: orderData.customerPhone || '',
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.items,
      subtotal,
      serviceFee,
      deliveryFee,
      total,
      status: 'pending_cashier', // KASSA TASDIQLASHI KUTILMOQDA
      isPaid: false,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === newOrder.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newOrder;
        return copy;
      }
      return [newOrder, ...prev];
    });

    if (newOrder.type === 'dine_in' && newOrder.tableNumber) {
      updateTableStatus(newOrder.tableNumber, 'pending_cashier', newOrder.id, newOrder.waiterId, newOrder.waiterName);
    }

    playSound('order');
    showToast(`Buyurtma (${newOrder.orderNumber}) Kassaga yuborildi! Kassa tasdiqlaydi.`, 'success');
    return newOrder;
  };

  // 2. KASSA BUYURTMANI OSHXONAGA YUBORADI
  const approveAndSendToKitchenFromCashier = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status: 'cooking' as OrderStatus,
            sentToKitchenAt: new Date().toISOString()
          };
          if (o.type === 'dine_in' && o.tableNumber) {
            updateTableStatus(o.tableNumber, 'cooking', o.id);
          }
          return updated;
        }
        return o;
      })
    );

    playSound('order');
    showToast(`Kassa: Buyurtma oshxonaga yuborildi (KDS ga tushdi)!`, 'success');
  };

  // 3. TO'LOV VA CHEK FAQAT KASSA TOMONIDAN AMALGA OSHIRILADI
  const processCashierPayment = (orderId: string, paymentMethod: PaymentMethod, cashGiven?: number) => {
    let closedOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const change = cashGiven && cashGiven > o.total ? cashGiven - o.total : 0;
          closedOrder = {
            ...o,
            isPaid: true,
            paymentMethod,
            cashGiven: cashGiven || o.total,
            changeDue: change,
            status: 'completed' as OrderStatus,
            completedAt: new Date().toISOString()
          };
          return closedOrder;
        }
        return o;
      })
    );

    // Free table if dine_in
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.type === 'dine_in' && targetOrder.tableNumber) {
      updateTableStatus(targetOrder.tableNumber, 'available', undefined, undefined, undefined);
    }

    // Update waiter stats
    if (targetOrder?.waiterId) {
      setWaiters((prev) =>
        prev.map((w) =>
          w.id === targetOrder.waiterId
            ? {
                ...w,
                ordersCount: w.ordersCount + 1,
                todaySales: w.todaySales + targetOrder.total,
                todayTips: w.todayTips + targetOrder.serviceFee
              }
            : w
        )
      );
    }

    playSound('ready');
    showToast('Kassa: To‘lov to‘liq qabul qilindi, chek chiqarilmoqda!', 'success');
    if (closedOrder) {
      setActiveReceiptOrder(closedOrder);
    }
  };

  // Backward compatibility createOrder for website cart
  const createOrder = (orderData: Partial<Order> & { items: OrderItem[] }): Order => {
    return sendOrderToCashier(orderData);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt
          };

          if (o.type === 'dine_in' && o.tableNumber) {
            if (status === 'ready') {
              updateTableStatus(o.tableNumber, 'occupied', o.id);
            } else if (status === 'completed' || status === 'cancelled') {
              updateTableStatus(o.tableNumber, 'available', undefined, undefined, undefined);
            }
          }

          if (o.courierId && (status === 'completed' || status === 'cancelled')) {
            setCouriers((cList) =>
              cList.map((c) =>
                c.id === o.courierId
                  ? {
                      ...c,
                      activeOrdersCount: Math.max(0, c.activeOrdersCount - 1),
                      completedOrdersCount: status === 'completed' ? c.completedOrdersCount + 1 : c.completedOrdersCount,
                      status: c.activeOrdersCount <= 1 ? 'available' : 'busy'
                    }
                  : c
              )
            );
          }

          return updated;
        }
        return o;
      })
    );

    if (status === 'ready') {
      playSound('ready');
      showToast('Oshxona: Taomlar tayyor bo‘ldi!', 'info');
    }
  };

  const assignCourier = (orderId: string, courierId: string) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              courierId,
              courierName: courier.name,
              status: 'delivering',
              deliveryCoords: {
                lat: 41.2995 + (Math.random() - 0.5) * 0.02,
                lng: 69.2401 + (Math.random() - 0.5) * 0.02,
                distanceKm: Math.round((2.5 + Math.random() * 4) * 10) / 10,
                etaMinutes: Math.floor(15 + Math.random() * 20),
              }
            }
          : o
      )
    );

    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courierId
          ? { ...c, status: 'busy', activeOrdersCount: c.activeOrdersCount + 1 }
          : c
      )
    );

    showToast(`Kuryer ${courier.name} biriktirildi. GPS jonli kuzatuvi yoqildi!`, 'success');
  };

  const payAndCloseOrder = (orderId: string, paymentMethod: PaymentMethod) => {
    processCashierPayment(orderId, paymentMethod);
  };

  // --- GPS SIMULATION ---
  const simulateCourierGps = () => {
    setCouriers((prev) =>
      prev.map((c) => {
        if (!c.gps) return c;
        const deltaLat = (Math.random() - 0.5) * 0.003;
        const deltaLng = (Math.random() - 0.5) * 0.003;
        return {
          ...c,
          gps: {
            ...c.gps,
            lat: c.gps.lat + deltaLat,
            lng: c.gps.lng + deltaLng,
            speedKmH: Math.floor(25 + Math.random() * 25),
            lastUpdated: 'Hozirgina'
          }
        };
      })
    );
    showToast('GPS koordinatalari va kuryerlar harakati yangilandi.', 'info');
  };

  // --- MENU ---
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `dish-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`"${newItem.name}" menyuga qo‘shildi!`, 'success');
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
    showToast('Taom yangilandi.', 'info');
  };

  const toggleDishAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((d) => d.id !== id));
    showToast('Taom o‘chirildi.', 'info');
  };

  // --- OFITSIANTLAR ---
  const loginWaiter = (pin?: string): boolean => {
    const cleanPin = (pin || '').trim();
    if (!cleanPin) {
      showToast('PIN kod kiritilmadi!', 'warning');
      return false;
    }
    const matched = waiters.find((w) => w.pin.trim() === cleanPin);
    if (matched) {
      setCurrentWaiter(matched);
      showToast(`Xush kelibsiz, ofitsiant ${matched.name}!`, 'success');
      return true;
    }
    showToast('Noto‘g‘ri PIN kod! Kirish rad etildi.', 'warning');
    return false;
  };

  const logoutWaiter = () => {
    setCurrentWaiter(null);
    setMode('customer');
    showToast('Ofitsiant rejimidan chiqildi.', 'info');
  };

  const addWaiter = (waiter: Omit<Waiter, 'id' | 'todaySales' | 'todayTips' | 'ordersCount'>) => {
    const newWaiter: Waiter = {
      ...waiter,
      id: `waiter-${Date.now()}`,
      todaySales: 0,
      todayTips: 0,
      ordersCount: 0,
    };
    setWaiters((prev) => [...prev, newWaiter]);
    showToast(`Ofitsiant ${newWaiter.name} qo‘shildi! (PIN: ${newWaiter.pin})`, 'success');
  };

  const updateWaiter = (id: string, waiter: Partial<Waiter>) => {
    setWaiters((prev) => prev.map((w) => (w.id === id ? { ...w, ...waiter } : w)));
  };

  const deleteWaiter = (id: string) => {
    setWaiters((prev) => prev.filter((w) => w.id !== id));
    showToast('Ofitsiant o‘chirildi.', 'info');
  };

  // --- KURYERLAR ---
  const addCourier = (courier: Omit<Courier, 'id' | 'activeOrdersCount' | 'completedOrdersCount'>) => {
    const newCourier: Courier = {
      ...courier,
      id: `courier-${Date.now()}`,
      activeOrdersCount: 0,
      completedOrdersCount: 0,
      gps: {
        lat: 41.2858 + (Math.random() - 0.5) * 0.03,
        lng: 69.2034 + (Math.random() - 0.5) * 0.03,
        district: 'Chilonzor tumani',
        speedKmH: 30,
        batteryPercent: 92,
        isMoving: true,
        lastUpdated: 'Hozirgina'
      }
    };
    setCouriers((prev) => [...prev, newCourier]);
    showToast(`Kuryer ${newCourier.name} tizimga qo‘shildi!`, 'success');
  };

  const updateCourier = (id: string, courier: Partial<Courier>) => {
    setCouriers((prev) => prev.map((c) => (c.id === id ? { ...c, ...courier } : c)));
  };

  const deleteCourier = (id: string) => {
    setCouriers((prev) => prev.filter((c) => c.id !== id));
    showToast('Kuryer o‘chirildi.', 'info');
  };

  // --- BRONLAR & SHARHLAR ---
  const addReservation = (res: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newRes: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newRes, ...prev]);
    showToast('Stol bron qilish so‘rovingiz qabul qilindi!', 'success');
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const addReview = (rev: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: 'Hozirgina'
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Sharhingiz uchun rahmat!', 'success');
  };

  // --- SAVATCHA ---
  const addToCart = (dish: MenuItem, quantity: number = 1, note?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dishId === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + quantity, note: note || item.note }
            : item
        );
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity, note }];
    });
    showToast(`"${dish.name}" savatchaga qo‘shildi!`, 'success');
  };

  const updateCartItemQty = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dishId === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dishId !== dishId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- CHEK MODAL ---
  const openReceiptModal = (order: Order) => setActiveReceiptOrder(order);
  const closeReceiptModal = () => setActiveReceiptOrder(null);

  // --- ADMIN LOGIN ---
  const loginAdmin = (password?: string): boolean => {
    const clean = (password || '').trim();
    if (clean === 'laziz712' || clean === 'laziz71') {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('sofra_admin_auth', 'true');
      } catch {}
      showToast('Admin paneliga muvaffaqiyatli kirildi!', 'success');
      return true;
    }
    showToast('Noto‘g‘ri admin paroli! Kirish rad etildi.', 'warning');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('sofra_admin_auth');
    } catch {}
    setMode('customer');
    showToast('Admin panelidan chiqildi.', 'info');
  };

  return (
    <RestaurantContext.Provider
      value={{
        mode,
        setMode,
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleDishAvailability,
        deleteMenuItem,
        orders,
        createOrder,
        sendOrderToCashier,
        approveAndSendToKitchenFromCashier,
        processCashierPayment,
        updateOrderStatus,
        assignCourier,
        payAndCloseOrder,
        tables,
        addTable,
        deleteTable,
        updateTable,
        updateTableStatus,
        waiters,
        currentWaiter,
        loginWaiter,
        logoutWaiter,
        addWaiter,
        updateWaiter,
        deleteWaiter,
        couriers,
        addCourier,
        updateCourier,
        deleteCourier,
        simulateCourierGps,
        reservations,
        addReservation,
        updateReservationStatus,
        reviews,
        addReview,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        activeReceiptOrder,
        openReceiptModal,
        closeReceiptModal,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        notification,
        showToast,
        playSound,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

import { MenuItem, Table, Order } from './types';

export const menuCategories = [
  'Burger and Sandwich',
  'Wraps & Pasta',
  'Fried Chicken',
  'Pizza',
  'Egg Items & Fries',
  'Beverages',
  'Biryani & Rice',
  'Soups & Salads',
  'Desserts',
  'Indian Breads',
];

export const menuItems: MenuItem[] = [
  // Burger and Sandwich
  { id: 1, name: 'Aalo jeera (half)', price: 350, category: 'Burger and Sandwich' },
  { id: 2, name: 'Aalo jeera Full', price: 450, category: 'Burger and Sandwich' },
  { id: 3, name: 'Aalo Paratha+curd', price: 185, category: 'Burger and Sandwich' },
  { id: 4, name: 'Add On Caramelized Banana', price: 80, category: 'Burger and Sandwich' },
  { id: 5, name: 'Add On chicken', price: 50, category: 'Burger and Sandwich' },
  { id: 6, name: 'Afgani Chicken Tikka (Sai)', price: 0, category: 'Burger and Sandwich' },
  { id: 7, name: 'Appam (Vellayappam)', price: 36, category: 'Burger and Sandwich' },
  { id: 8, name: 'Appam(Vellayappam) Single', price: 12, category: 'Burger and Sandwich' },
  { id: 9, name: 'apple juice', price: 60, category: 'Burger and Sandwich' },
  { id: 10, name: 'Ayala Curry', price: 200, category: 'Burger and Sandwich' },
  { id: 11, name: 'Ayala Fry', price: 130, category: 'Burger and Sandwich' },
  { id: 12, name: 'Baby corn Manchurian', price: 150, category: 'Burger and Sandwich' },
  { id: 13, name: 'BBQ Burger', price: 159, category: 'Burger and Sandwich' },
  { id: 14, name: 'Boleness Strip 2', price: 79, category: 'Burger and Sandwich' },

  // Wraps & Pasta
  { id: 15, name: 'Chicken Wrap', price: 120, category: 'Wraps & Pasta' },
  { id: 16, name: 'Veg Wrap', price: 90, category: 'Wraps & Pasta' },
  { id: 17, name: 'Penne Arrabbiata', price: 180, category: 'Wraps & Pasta' },
  { id: 18, name: 'Pasta Alfredo', price: 200, category: 'Wraps & Pasta' },
  { id: 19, name: 'Spaghetti Bolognese', price: 220, category: 'Wraps & Pasta' },
  { id: 20, name: 'Mexican Wrap', price: 150, category: 'Wraps & Pasta' },

  // Fried Chicken
  { id: 21, name: 'Fried Chicken (2pc)', price: 149, category: 'Fried Chicken' },
  { id: 22, name: 'Fried Chicken (4pc)', price: 259, category: 'Fried Chicken' },
  { id: 23, name: 'Crispy Chicken Strips', price: 179, category: 'Fried Chicken' },
  { id: 24, name: 'Chicken Popcorn', price: 129, category: 'Fried Chicken' },
  { id: 25, name: 'Spicy Wings (6pc)', price: 199, category: 'Fried Chicken' },

  // Pizza
  { id: 26, name: 'Margherita 10 inch onion', price: 299, category: 'Pizza' },
  { id: 27, name: 'Pepperoni Pizza', price: 349, category: 'Pizza' },
  { id: 28, name: 'Veggie Supreme', price: 299, category: 'Pizza' },
  { id: 29, name: 'BBQ Chicken Pizza', price: 399, category: 'Pizza' },
  { id: 30, name: 'Paneer Tikka Pizza', price: 329, category: 'Pizza' },

  // Egg Items & Fries
  { id: 31, name: 'Egg Bhurji', price: 80, category: 'Egg Items & Fries' },
  { id: 32, name: 'Omelette (2 egg)', price: 60, category: 'Egg Items & Fries' },
  { id: 33, name: 'French Fries', price: 89, category: 'Egg Items & Fries' },
  { id: 34, name: 'Cheese Fries', price: 119, category: 'Egg Items & Fries' },
  { id: 35, name: 'Masala Egg Fry', price: 70, category: 'Egg Items & Fries' },

  // Beverages
  { id: 36, name: 'Fresh Lime Soda', price: 60, category: 'Beverages' },
  { id: 37, name: 'Cold Coffee', price: 90, category: 'Beverages' },
  { id: 38, name: 'Mango Lassi', price: 80, category: 'Beverages' },
  { id: 39, name: 'Masala Chai', price: 30, category: 'Beverages' },
  { id: 40, name: 'Coca Cola', price: 40, category: 'Beverages' },

  // Biryani & Rice
  { id: 41, name: 'Biriyani Rice', price: 80, category: 'Biryani & Rice' },
  { id: 42, name: 'Chicken Biryani', price: 220, category: 'Biryani & Rice' },
  { id: 43, name: 'Mutton Biryani', price: 280, category: 'Biryani & Rice' },
  { id: 44, name: 'Veg Biryani', price: 150, category: 'Biryani & Rice' },
  { id: 45, name: 'Fried Rice', price: 130, category: 'Biryani & Rice' },

  // Soups & Salads
  { id: 46, name: 'Tomato Soup', price: 70, category: 'Soups & Salads' },
  { id: 47, name: 'Sweet Corn Soup', price: 80, category: 'Soups & Salads' },
  { id: 48, name: 'Caesar Salad', price: 120, category: 'Soups & Salads' },
  { id: 49, name: 'Greek Salad', price: 110, category: 'Soups & Salads' },

  // Desserts
  { id: 50, name: 'Gulab Jamun', price: 60, category: 'Desserts' },
  { id: 51, name: 'Ice Cream (2 scoops)', price: 80, category: 'Desserts' },
  { id: 52, name: 'Brownie', price: 90, category: 'Desserts' },
  { id: 53, name: 'Rasgulla', price: 55, category: 'Desserts' },

  // Indian Breads
  { id: 54, name: 'Butter Naan', price: 30, category: 'Indian Breads' },
  { id: 55, name: 'Garlic Naan', price: 40, category: 'Indian Breads' },
  { id: 56, name: 'Roti', price: 15, category: 'Indian Breads' },
  { id: 57, name: 'Paratha', price: 45, category: 'Indian Breads' },
];

export const tableSections = ['GROUND', 'FLOOR', 'VIP', 'GARDEN', 'AC', 'BAR', 'TESTAB'];

export const initialTables: Table[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 2,
    name: `Table-${i + 2}`,
    section: 'GROUND',
    status: 'available' as const,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 22,
    name: `Table-${i + 22}`,
    section: 'FLOOR',
    status: 'available' as const,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 32,
    name: `VIP-${i + 1}`,
    section: 'VIP',
    status: 'available' as const,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 37,
    name: `Garden-${i + 1}`,
    section: 'GARDEN',
    status: 'available' as const,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: i + 45,
    name: `AC-${i + 1}`,
    section: 'AC',
    status: 'available' as const,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: i + 51,
    name: `Bar-${i + 1}`,
    section: 'BAR',
    status: 'available' as const,
  })),
];

export const sampleOrders: Order[] = [
  {
    id: 'TDO-R12813',
    tableNo: 'Table-3',
    orderType: 'dine-in',
    items: [
      { id: 1, menuItem: menuItems[0], quantity: 2, remark: '' },
      { id: 2, menuItem: menuItems[14], quantity: 1, remark: '' },
    ],
    status: 'pending',
    createdAt: new Date('2022-12-22T15:08:09'),
    discount: 0,
    charges: 0,
  },
  {
    id: 'TDO-R12814',
    tableNo: 'Take Away',
    orderType: 'take-away',
    items: [
      { id: 1, menuItem: menuItems[25], quantity: 1, remark: '' },
    ],
    status: 'pending',
    createdAt: new Date('2022-12-22T15:09:48'),
    discount: 0,
    charges: 0,
  },
];

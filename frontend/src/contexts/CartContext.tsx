import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MenuItem, CartItem, Cart } from '../backend';
import { useActor } from '../hooks/useActor';

interface CartContextType {
  cart: Cart | null;
  restaurantId: string | null;
  addItem: (restaurantId: string, item: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'foodhub_cart';
const RESTAURANT_STORAGE_KEY = 'foodhub_restaurant';

export function CartProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const [cart, setCart] = useState<Cart | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedRestaurant = localStorage.getItem(RESTAURANT_STORAGE_KEY);
    if (savedCart && savedRestaurant) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        setRestaurantId(savedRestaurant);
      } catch (e) {
        console.error('Failed to load cart from storage', e);
      }
    }
  }, []);

  // Recalculate cart whenever items change
  useEffect(() => {
    if (!actor || cartItems.length === 0) {
      setCart(null);
      return;
    }

    actor.calculateCart(cartItems).then((calculatedCart) => {
      setCart(calculatedCart);
    });
  }, [actor, cartItems]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 && restaurantId) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      localStorage.setItem(RESTAURANT_STORAGE_KEY, restaurantId);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(RESTAURANT_STORAGE_KEY);
    }
  }, [cartItems, restaurantId]);

  const addItem = (newRestaurantId: string, item: MenuItem, quantity: number) => {
    // If adding from a different restaurant, clear cart
    if (restaurantId && restaurantId !== newRestaurantId) {
      if (!confirm('Adding items from a different restaurant will clear your cart. Continue?')) {
        return;
      }
      setCartItems([]);
    }

    setRestaurantId(newRestaurantId);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + BigInt(quantity),
        };
        return updated;
      }
      return [...prev, { item, quantity: BigInt(quantity) }];
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => {
      const filtered = prev.filter((ci) => ci.item.id !== itemId);
      if (filtered.length === 0) {
        setRestaurantId(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: BigInt(quantity) } : ci))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setCart(null);
  };

  const itemCount = cartItems.reduce((sum, ci) => sum + Number(ci.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

import { createContext, useContext, useMemo, useState } from "react";
import { getFinalPrice } from "../data/products.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("mithri_cart");
    return saved ? JSON.parse(saved) : [];
  });

  function persist(nextItems) {
    setItems(nextItems);
    localStorage.setItem("mithri_cart", JSON.stringify(nextItems));
  }

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      retailSubtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      subtotal: items.reduce((total, item) => total + getFinalPrice(item) * item.quantity, 0),
      discountTotal: items.reduce((total, item) => total + (item.price - getFinalPrice(item)) * item.quantity, 0),
      addItem: (product, size = product.sizes?.[0] ?? "One size", color = product.colors?.[0] ?? product.color ?? "Core") => {
        const existing = items.find((item) => item.id === product.id && item.size === size && item.color === color);
        const nextItems = existing
          ? items.map((item) =>
              item.id === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...items, { ...product, size, color, quantity: 1 }];
        persist(nextItems);
      },
      updateQuantity: (id, size, color, quantity) => {
        const nextItems = items
          .map((item) => (item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);
        persist(nextItems);
      },
      removeItem: (id, size, color) => persist(items.filter((item) => !(item.id === id && item.size === size && item.color === color))),
      clearCart: () => persist([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

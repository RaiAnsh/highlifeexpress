"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, ProductCardData } from "./types";

const CART_STORAGE_KEY = "hle_cart_v2";

type SiteContextValue = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  changeQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalCents: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  activeProduct: ProductCardData | null;
  openProductModal: (product: ProductCardData) => void;
  closeProductModal: () => void;

  isReservationOpen: boolean;
  openReservationModal: () => void;
  closeReservationModal: () => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductCardData | null>(null);
  const [isReservationOpen, setReservationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      setCart([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart: SiteContextValue["addToCart"] = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => (i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty: SiteContextValue["changeQty"] = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart: SiteContextValue["removeFromCart"] = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotalCents = cart.reduce((sum, i) => sum + i.qty * i.unitPriceCents, 0);

  const value = useMemo<SiteContextValue>(
    () => ({
      cart,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotalCents,
      isCartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      activeProduct,
      openProductModal: (product) => setActiveProduct(product),
      closeProductModal: () => setActiveProduct(null),
      isReservationOpen,
      openReservationModal: () => {
        setCartOpen(false);
        setReservationOpen(true);
      },
      closeReservationModal: () => setReservationOpen(false),
      searchTerm,
      setSearchTerm,
    }),
    [cart, cartCount, cartSubtotalCents, isCartOpen, activeProduct, isReservationOpen, searchTerm] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within a SiteProvider");
  return ctx;
}

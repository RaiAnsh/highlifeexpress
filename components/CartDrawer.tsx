"use client";

import { useSite } from "@/lib/site-context";
import { formatCents } from "@/lib/pricing";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, changeQty, removeFromCart, cartSubtotalCents, openReservationModal } =
    useSite();

  return (
    <>
      <div className={`cart-overlay${isCartOpen ? " open" : ""}`} onClick={closeCart} />
      <div className={`cart-drawer${isCartOpen ? " open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">&times;</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty.<br />Add some products to get started!</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item-thumb">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : "\ud83c\udf3f"}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{item.priceLabel}</div>
                  <div className="cart-qty">
                    <button onClick={() => changeQty(item.productId, -1)}>&minus;</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.productId, 1)}>&plus;</button>
                    <button className="cart-remove" onClick={() => removeFromCart(item.productId)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-drawer-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span>{formatCents(cartSubtotalCents)}</span>
          </div>
          <button className="cart-checkout-btn" disabled={cart.length === 0} onClick={openReservationModal}>
            Request Delivery
          </button>
          <p className="cart-note">
            No payment is taken online. We&apos;ll contact you to confirm your order and delivery details.
          </p>
        </div>
      </div>
    </>
  );
}

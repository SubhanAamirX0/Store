import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import CartItem from "../components/CartItem.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/currency.js";

export default function Cart() {
  const { items, subtotal, discountTotal, retailSubtotal } = useCart();
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Your cart</h1>
      {items.length ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(retailSubtotal)}</span></p>
              <p className="flex justify-between"><span>Discount</span><span>{discountTotal ? `-${formatCurrency(discountTotal)}` : formatCurrency(0)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>{shipping ? formatCurrency(shipping) : "Free"}</span></p>
              <p className="flex justify-between border-t border-black/10 pt-3 text-lg font-black"><span>Total</span><span>{formatCurrency(total)}</span></p>
            </div>
            <Button as={Link} to="/checkout" className="mt-6 w-full">
              Checkout
            </Button>
          </aside>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-black/10 bg-white p-10 text-center">
          <p className="text-lg font-bold">Your cart is empty.</p>
          <Button as={Link} to="/shop" className="mt-5">
            Start shopping
          </Button>
        </div>
      )}
    </section>
  );
}

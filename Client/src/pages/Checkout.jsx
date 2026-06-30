import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getFinalPrice } from "../data/products.js";
import { apiRequest } from "../utils/api.js";
import { formatCurrency } from "../utils/currency.js";

const objectIdPattern = /^[a-f\d]{24}$/i;

export default function Checkout() {
  const { items, subtotal, discountTotal, retailSubtotal, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  function updateField(field, value) {
    setShippingAddress((address) => ({ ...address, [field]: value }));
  }

  async function placeOrder(event) {
    event.preventDefault();
    setMessage("");

    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/orders", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          items: items.map((item) => ({
            product: objectIdPattern.test(String(item.id)) ? item.id : undefined,
            title: item.name,
            price: getFinalPrice(item),
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          })),
          shippingAddress,
          subtotal,
          discountTotal,
          shippingTotal: shipping,
          total
        })
      });
      clearCart();
      setMessage("Order placed. You can track it from your orders page.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div>
        <h1 className="text-4xl font-black">Checkout</h1>
        <form className="mt-8 grid gap-4 rounded-lg border border-black/10 bg-white p-6 shadow-sm" onSubmit={placeOrder}>
          <Input label="Full name" required value={shippingAddress.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
          <Input label="Email" type="email" required value={shippingAddress.email} onChange={(event) => updateField("email", event.target.value)} />
          <Input label="Shipping address" required value={shippingAddress.address} onChange={(event) => updateField("address", event.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="City" required value={shippingAddress.city} onChange={(event) => updateField("city", event.target.value)} />
            <Input label="Postal code" required value={shippingAddress.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Country" required value={shippingAddress.country} onChange={(event) => updateField("country", event.target.value)} />
            <Input label="Phone" required value={shippingAddress.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
          {message ? <p className="rounded-md bg-cedar/10 px-3 py-2 text-sm font-semibold text-cedar">{message}</p> : null}
          <Button type="submit" disabled={submitting || !items.length}>
            {submitting ? "Placing order..." : "Place order"}
          </Button>
          {!items.length ? (
            <Button as={Link} to="/shop" variant="secondary">
              Continue shopping
            </Button>
          ) : null}
        </form>
      </div>
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Payment summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(retailSubtotal)}</span></p>
          <p className="flex justify-between"><span>Discount</span><span>{discountTotal ? `-${formatCurrency(discountTotal)}` : formatCurrency(0)}</span></p>
          <p className="flex justify-between"><span>Shipping</span><span>{shipping ? formatCurrency(shipping) : "Free"}</span></p>
          <p className="flex justify-between border-t border-black/10 pt-3 text-lg font-black"><span>Total</span><span>{formatCurrency(total)}</span></p>
        </div>
        <div className="mt-5 space-y-3 border-t border-black/10 pt-5">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between gap-3 text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-semibold">{formatCurrency(getFinalPrice(item) * item.quantity)}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

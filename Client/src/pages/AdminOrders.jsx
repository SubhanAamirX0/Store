import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { apiRequest } from "../utils/api.js";
import { formatCurrency } from "../utils/currency.js";

function formatAddress(order) {
  const address = order.shippingAddress ?? {};
  return [address.fullName, address.address, address.city, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const data = await apiRequest("/orders", { auth: true });
        if (active) setOrders(data.orders);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-night/25 pb-5">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cedar">Admin</p>
        <h1 className="text-4xl font-black">Received orders</h1>
        <p className="max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.08em] text-black/60">
          View every order with order number, item breakdown, customer details, and delivery info.
        </p>
      </div>

      {error ? <p className="mt-5 rounded-md bg-rust/10 px-4 py-3 text-sm font-semibold text-rust">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm font-semibold text-black/55">Loading received orders...</p> : null}

      {!loading && orders.length ? (
        <div className="mt-8 grid gap-5">
          {orders.map((order) => (
            <article key={order._id} className="overflow-hidden rounded-2xl border border-night/20 bg-paper shadow-soft">
              <div className="grid gap-4 border-b border-night/15 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-rust">Order</p>
                  <h2 className="mt-2 text-2xl font-black">MTH-{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="mt-1 text-sm font-semibold text-night/65">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cedar/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cedar">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-rust/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rust">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.22em] text-cedar">Ordered items</h3>
                  <div className="mt-4 grid gap-3">
                    {order.items.map((item, index) => (
                      <div key={`${item.product ?? item.title}-${index}`} className="rounded-xl border border-night/15 bg-white/70 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-black uppercase tracking-[0.08em]">{item.title}</p>
                            <p className="mt-1 text-sm text-night/65">
                              Qty {item.quantity} {item.size ? `• Size ${item.size}` : ""} {item.color ? `• ${item.color}` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-black">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-xl border border-night/15 bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cedar">Customer</p>
                    <p className="mt-2 font-black">{order.user?.name ?? "Unknown customer"}</p>
                    <p className="text-sm text-night/65">{order.user?.email ?? "No email"}</p>
                  </div>
                  <div className="rounded-xl border border-night/15 bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cedar">Delivery</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-night/75">{formatAddress(order) || "No shipping address"}</p>
                  </div>
                  <div className="rounded-xl border border-night/15 bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cedar">Totals</p>
                    <div className="mt-2 grid gap-1 text-sm font-semibold text-night/75">
                      <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                      <p>Discount: {formatCurrency(order.discountTotal)}</p>
                      <p>Shipping: {formatCurrency(order.shippingTotal)}</p>
                      <p className="font-black text-ink">Total: {formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !orders.length ? (
        <div className="mt-8 rounded-2xl border border-night/15 bg-paper p-10 text-center shadow-soft">
          <p className="text-lg font-bold">No received orders yet.</p>
          <Button as={Link} to="/shop" className="mt-5">
            Go to shop
          </Button>
        </div>
      ) : null}
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { apiRequest } from "../utils/api.js";
import { formatCurrency } from "../utils/currency.js";

const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

function formatAddress(order) {
  const address = order.shippingAddress ?? {};
  return [address.fullName, address.address, address.city, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}

function getItemImage(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images[0];
  if (item.image) return item.image;
  if (item.product?.images?.length) return item.product.images[0];
  return item.product?.image ?? "";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");

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

  async function updateOrderStatus(order, status) {
    setSavingOrderId(order._id);
    try {
      await apiRequest(`/orders/${order._id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          status,
          paymentStatus: status === "paid" ? "paid" : order.paymentStatus
        })
      });

      const data = await apiRequest("/orders", { auth: true });
      setOrders(data.orders);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingOrderId("");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-2 border-b border-night/25 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cedar sm:text-sm sm:tracking-[0.25em]">Admin</p>
        <h1 className="text-3xl font-black sm:text-4xl">Received orders</h1>
        <p className="max-w-2xl text-xs font-semibold uppercase leading-5 tracking-[0.06em] text-black/60 sm:text-sm sm:leading-6 sm:tracking-[0.08em]">
          View every order with order number, item breakdown, customer details, and delivery info.
        </p>
      </div>

      {error ? <p className="mt-4 rounded-md bg-rust/10 px-4 py-3 text-sm font-semibold text-rust">{error}</p> : null}
      {loading ? <p className="mt-6 text-sm font-semibold text-black/55">Loading received orders...</p> : null}

      {!loading && orders.length ? (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="overflow-hidden rounded-2xl border border-night/20 bg-paper shadow-soft">
              <div className="grid gap-3 border-b border-night/15 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rust sm:text-xs sm:tracking-[0.22em]">Order</p>
                  <h2 className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">MTH-{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="mt-1 text-xs font-semibold text-night/65 sm:text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-night/70 sm:hidden">
                    {order.user?.name ?? "Unknown customer"} • {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cedar/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cedar sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-rust/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-rust sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                    {order.paymentStatus}
                  </span>
                  <label className="flex items-center gap-2 rounded-full border border-night/15 bg-white/80 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-night/70">
                    <span>Status</span>
                    <select
                      className="bg-transparent text-[10px] font-black uppercase tracking-[0.14em] outline-none"
                      value={order.status}
                      disabled={savingOrderId === order._id}
                      onChange={(event) => updateOrderStatus(order, event.target.value)}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cedar sm:text-xs sm:tracking-[0.22em]">Ordered items</h3>
                  <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
                    {order.items.map((item, index) => (
                      <div key={`${item.product ?? item.title}-${index}`} className="rounded-xl border border-night/15 bg-white/70 p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {getItemImage(item) ? (
                            <img
                              src={getItemImage(item)}
                              alt={item.title}
                              className="h-16 w-16 flex-none rounded-lg border border-night/10 object-cover sm:h-20 sm:w-20"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black uppercase tracking-[0.06em] sm:text-base">{item.title}</p>
                                <p className="mt-1 text-[11px] text-night/65 sm:text-sm">
                                  Qty {item.quantity}
                                  {item.size ? ` • Size ${item.size}` : ""}
                                  {item.color ? ` • ${item.color}` : ""}
                                </p>
                              </div>
                              <p className="text-sm font-black sm:text-base">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4">
                  <div className="rounded-xl border border-night/15 bg-white/70 p-3 sm:p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cedar sm:text-xs sm:tracking-[0.22em]">Customer</p>
                    <p className="mt-1.5 text-sm font-black sm:mt-2">{order.user?.name ?? "Unknown customer"}</p>
                    <p className="text-xs text-night/65 sm:text-sm">{order.user?.email ?? "No email"}</p>
                  </div>
                  <div className="rounded-xl border border-night/15 bg-white/70 p-3 sm:p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cedar sm:text-xs sm:tracking-[0.22em]">Delivery</p>
                    <p className="mt-1.5 text-xs font-semibold leading-5 text-night/75 sm:mt-2 sm:text-sm sm:leading-6">
                      {formatAddress(order) || "No shipping address"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-night/15 bg-white/70 p-3 sm:p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cedar sm:text-xs sm:tracking-[0.22em]">Totals</p>
                    <div className="mt-1.5 grid gap-1 text-xs font-semibold text-night/75 sm:mt-2 sm:text-sm">
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
        <div className="mt-6 rounded-2xl border border-night/15 bg-paper p-8 text-center shadow-soft sm:mt-8 sm:p-10">
          <p className="text-base font-bold sm:text-lg">No received orders yet.</p>
          <Button as={Link} to="/shop" className="mt-4 sm:mt-5">
            Go to shop
          </Button>
        </div>
      ) : null}
    </section>
  );
}

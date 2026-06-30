import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import { apiRequest } from "../utils/api.js";
import { formatCurrency } from "../utils/currency.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const data = await apiRequest("/orders/mine", { auth: true });
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
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Orders</h1>
      {error ? <p className="mt-5 rounded-md bg-rust/10 px-4 py-3 text-sm font-semibold text-rust">{error}</p> : null}
      {loading ? <p className="mt-8 text-sm font-semibold text-black/55">Loading orders...</p> : null}
      {!loading && orders.length ? (
        <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
          {orders.map((order) => (
            <div key={order._id} className="grid gap-2 border-b border-black/10 p-5 last:border-b-0 sm:grid-cols-4 sm:items-center">
              <p className="font-bold">MTH-{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-black/60">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="font-semibold">{formatCurrency(order.total)}</p>
              <span className="w-fit rounded-full bg-cedar/10 px-3 py-1 text-sm font-bold capitalize text-cedar">{order.status}</span>
            </div>
          ))}
        </div>
      ) : null}
      {!loading && !orders.length ? (
        <div className="mt-8 rounded-lg border border-black/10 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold">No orders yet.</p>
          <Button as={Link} to="/shop" className="mt-5">Start shopping</Button>
        </div>
      ) : null}
    </section>
  );
}

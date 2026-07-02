import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));

function PageFallback() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <Loader label="Loading page" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

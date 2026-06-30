import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

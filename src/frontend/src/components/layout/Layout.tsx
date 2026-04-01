import { Outlet } from "@tanstack/react-router";
import { useInitSampleData } from "../../hooks/useRestaurants";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  useInitSampleData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

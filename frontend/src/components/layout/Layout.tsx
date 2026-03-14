import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import CartButton from '../cart/CartButton';
import { useInitSampleData } from '../../hooks/useRestaurants';

export default function Layout() {
  // Initialize sample data on app load
  useInitSampleData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartButton />
    </div>
  );
}

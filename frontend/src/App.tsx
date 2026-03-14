import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import RestaurantsPage from './pages/RestaurantsPage';
import MenuPage from './pages/MenuPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import RegisterRestaurantPage from './pages/RegisterRestaurantPage';
import ManageMenuPage from './pages/ManageMenuPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RestaurantsPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu/$restaurantId',
  component: MenuPage,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistoryPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const registerRestaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register-restaurant',
  component: RegisterRestaurantPage,
});

const manageMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage-menu/$restaurantId',
  component: ManageMenuPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  orderHistoryRoute,
  orderConfirmationRoute,
  registerRestaurantRoute,
  manageMenuRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

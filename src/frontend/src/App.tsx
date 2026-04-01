import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import HomePage from "./pages/HomePage";
import ManageMenuPage from "./pages/ManageMenuPage";
import MenuPage from "./pages/MenuPage";
import MyRestaurantsPage from "./pages/MyRestaurantsPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import RegisterRestaurantPage from "./pages/RegisterRestaurantPage";
import RestaurantsPage from "./pages/RestaurantsPage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: RestaurantsPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurant/$restaurantId",
  component: MenuPage,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrderHistoryPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

const registerRestaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register-restaurant",
  component: RegisterRestaurantPage,
});

const manageMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manage-menu/$restaurantId",
  component: ManageMenuPage,
});

const myRestaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-restaurants",
  component: MyRestaurantsPage,
});

// Legacy redirect for old menu route
const legacyMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu/$restaurantId",
  component: MenuPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  restaurantsRoute,
  menuRoute,
  legacyMenuRoute,
  orderHistoryRoute,
  orderConfirmationRoute,
  registerRestaurantRoute,
  manageMenuRoute,
  myRestaurantsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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

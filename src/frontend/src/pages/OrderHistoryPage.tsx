import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Package } from "lucide-react";
import OrderCard from "../components/orders/OrderCard";
import { useAuth } from "../contexts/AuthContext";
import { useOrderHistory } from "../hooks/useOrders";

const ORDER_SKELETONS = ["os1", "os2", "os3"];

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { data: orders, isLoading } = useOrderHistory();

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your order history
        </p>
        <Button onClick={login} data-ocid="login.button">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b">
        <div className="container py-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground mt-1">
            Track and view all your past orders
          </p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {isLoading ? (
          <div className="space-y-4" data-ocid="orders.loading_state">
            {ORDER_SKELETONS.map((id) => (
              <Skeleton key={id} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders
              .sort((a, b) => Number(b.timestamp - a.timestamp))
              .map((order, i) => {
                const position = i + 1;
                return (
                  <div key={order.id} data-ocid={`orders.item.${position}`}>
                    <OrderCard order={order} />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-20" data-ocid="orders.empty_state">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Place your first order to get started!
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              data-ocid="browse.primary_button"
            >
              Browse Restaurants
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

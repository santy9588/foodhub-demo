import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useOrderHistory } from '../hooks/useOrders';
import OrderCard from '../components/orders/OrderCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { data: orders, isLoading } = useOrderHistory();

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to view your order history</p>
        <Button onClick={login}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="font-display text-4xl font-bold">Order History</h1>
        <p className="text-muted-foreground mt-2">View all your past orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders
            .sort((a, b) => Number(b.timestamp - a.timestamp))
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => navigate({ to: '/' })}>Browse Restaurants</Button>
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import OrderStatusIndicator from "../components/orders/OrderStatusIndicator";
import { useOrder } from "../hooks/useOrders";

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container py-12 max-w-2xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
      </div>
    );
  }

  const totalPrice = Number(order.totalPrice) / 100;
  const estimatedTime = order.items.reduce(
    (max, item) => Math.max(max, Number(item.item.prepTime)),
    0,
  );

  return (
    <div className="container py-12 max-w-2xl">
      <div className="text-center mb-8 space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Your order has been placed successfully. Order ID:{" "}
          <span className="font-mono">{order.id}</span>
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusIndicator status={order.status} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Restaurant</p>
            <p className="font-semibold">{order.restaurant.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {Number(item.quantity)}x {item.item.name}
                  </span>
                  <span>
                    ₹
                    {(
                      (Number(item.item.price) * Number(item.quantity)) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Clock className="h-4 w-4" />
            <span>Estimated preparation time: {estimatedTime} minutes</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => navigate({ to: "/" })}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Button onClick={() => navigate({ to: "/orders" })} className="flex-1">
          View All Orders
        </Button>
      </div>
    </div>
  );
}

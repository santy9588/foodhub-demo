import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import type { Order } from "../../backend";
import OrderStatusIndicator from "./OrderStatusIndicator";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const totalPrice = Number(order.totalPrice) / 100;
  const orderDate = new Date(Number(order.timestamp) / 1000000); // Convert nanoseconds to milliseconds

  const statusColors = {
    confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    preparing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    outForDelivery: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {orderDate.toLocaleDateString()} at{" "}
              {orderDate.toLocaleTimeString()}
            </p>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status.charAt(0).toUpperCase() +
              order.status.slice(1).replace(/([A-Z])/g, " $1")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Restaurant
          </p>
          <p className="font-semibold">{order.restaurant.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Items</p>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.item.id} className="flex justify-between text-sm">
                <span>
                  {Number(item.quantity)}x {item.item.name}
                </span>
                <span className="text-muted-foreground">
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

        <div className="pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <OrderStatusIndicator status={order.status} />
      </CardContent>
    </Card>
  );
}

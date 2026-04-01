import { Separator } from "@/components/ui/separator";
import type { Cart } from "../../backend";

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const subtotal = Number(cart.subtotal) / 100;
  const platformFee = Number(cart.platformFee) / 100;
  const deliveryCharges = Number(cart.deliveryCharges) / 100;
  const total = Number(cart.total) / 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Platform Fee</span>
        <span>₹{platformFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Delivery Charges</span>
        <span>₹{deliveryCharges.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span className="text-primary">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}

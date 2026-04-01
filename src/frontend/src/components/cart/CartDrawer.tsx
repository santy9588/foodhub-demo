import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CheckoutButton from "./CheckoutButton";

export default function CartDrawer() {
  const { cart, itemCount } = useCart();

  if (!cart || itemCount === 0) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Your cart is empty</SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <img
              src="/assets/generated/empty-cart.dim_300x300.png"
              alt="Empty cart"
              className="w-48 h-48 mx-auto opacity-50"
            />
            <p className="text-muted-foreground">
              Add some delicious items to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-6 pb-4">
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-4 pb-4">
          {cart.items.map((cartItem) => (
            <CartItem key={cartItem.item.id} cartItem={cartItem} />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-6 space-y-4">
        <CartSummary cart={cart} />
        <CheckoutButton />
      </div>
    </div>
  );
}

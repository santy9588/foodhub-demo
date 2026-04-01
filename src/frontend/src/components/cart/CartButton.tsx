import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-warm-lg z-40 bg-primary hover:bg-primary/90 text-white"
          data-ocid="cart.open_modal_button"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-charcoal text-white border-2 border-white text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <CartDrawer />
      </SheetContent>
    </Sheet>
  );
}

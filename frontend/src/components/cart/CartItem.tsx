import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem as CartItemType } from '../../backend';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  cartItem: CartItemType;
}

export default function CartItem({ cartItem }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const quantity = Number(cartItem.quantity);
  const price = Number(cartItem.item.price) / 100;
  const total = price * quantity;

  return (
    <div className="flex gap-3 py-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{cartItem.item.name}</h4>
        <p className="text-sm text-muted-foreground">₹{price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateQuantity(cartItem.item.id, quantity - 1)}
            className="h-7 w-7 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateQuantity(cartItem.item.id, quantity + 1)}
            className="h-7 w-7 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(cartItem.item.id)}
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-semibold">₹{total.toFixed(2)}</p>
      </div>
    </div>
  );
}

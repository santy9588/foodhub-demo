import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { MenuItem, FoodType } from '../../backend';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
}

const FOOD_TYPE_CONFIG: Record<
  FoodType,
  { icon: string; color: string; label: string }
> = {
  veg: { icon: '/assets/generated/icon-veg.dim_64x64.png', color: 'text-green-600', label: 'Veg' },
  nonVeg: { icon: '/assets/generated/icon-nonveg.dim_64x64.png', color: 'text-red-600', label: 'Non-Veg' },
  beverage: { icon: '', color: 'text-blue-600', label: 'Beverage' },
  dessert: { icon: '', color: 'text-pink-600', label: 'Dessert' },
  snack: { icon: '', color: 'text-amber-600', label: 'Snack' },
};

export default function MenuItemCard({ item, restaurantId }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const config = FOOD_TYPE_CONFIG[item.foodType];
  const priceInRupees = Number(item.price) / 100;

  const handleAddToCart = () => {
    addItem(restaurantId, item, quantity);
    toast.success(`Added ${quantity}x ${item.name} to cart`);
    setQuantity(1);
  };

  const hasImage = item.imageUrl && item.imageUrl.trim() !== '' && !item.imageUrl.includes('example.com');

  return (
    <Card className="overflow-hidden hover:shadow-warm transition-shadow">
      {hasImage && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {imageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          {!imageError && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          )}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {config.icon && (
                <img src={config.icon} alt={config.label} className="h-5 w-5" />
              )}
              <h3 className="font-semibold text-lg">{item.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xl font-bold text-primary">₹{priceInRupees.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{Number(item.prepTime)} mins prep</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button onClick={handleAddToCart} size="sm">
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useNavigate } from '@tanstack/react-router';
import { Clock, ChefHat, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Restaurant } from '../../backend';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();

  const cuisineLabel = restaurant.cuisineType.charAt(0).toUpperCase() + restaurant.cuisineType.slice(1);

  return (
    <Card
      className="overflow-hidden hover:shadow-warm transition-all duration-300 cursor-pointer group"
      onClick={() => navigate({ to: '/menu/$restaurantId', params: { restaurantId: restaurant.id } })}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={restaurant.logoUrl || '/assets/generated/restaurant-placeholder.dim_200x200.png'}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/restaurant-placeholder.dim_200x200.png';
            }}
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur">
              {cuisineLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {restaurant.openingHours.openingTime} - {restaurant.openingHours.closingTime}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ChefHat className="h-4 w-4" />
          <span>Avg. prep time: {Number(restaurant.avgPrepTime)} mins</span>
        </div>
      </CardContent>
    </Card>
  );
}

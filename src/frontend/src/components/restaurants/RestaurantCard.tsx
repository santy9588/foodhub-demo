import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Star, Truck } from "lucide-react";
import type { Restaurant } from "../../backend";
import { getMockRating } from "../../utils/mockRating";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const SKELETON_IDS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
export { SKELETON_IDS };

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const rating = getMockRating(restaurant.id);
  const cuisineLabel =
    restaurant.cuisineType.charAt(0).toUpperCase() +
    restaurant.cuisineType.slice(1);

  return (
    <button
      type="button"
      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group text-left w-full"
      onClick={() =>
        navigate({
          to: "/restaurant/$restaurantId",
          params: { restaurantId: restaurant.id },
        })
      }
      aria-label={`View ${restaurant.name} menu`}
      data-ocid="restaurant.card"
    >
      {/* Food image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={
            restaurant.logoUrl ||
            "/assets/generated/restaurant-placeholder.dim_200x200.png"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/assets/generated/restaurant-placeholder.dim_200x200.png";
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold bg-primary text-white px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1">
            <Truck className="h-3 w-3" />
            FREE DELIVERY
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium bg-white/90 text-charcoal px-2 py-1 rounded-md backdrop-blur">
            {cuisineLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {restaurant.address}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>25-35 mins</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {restaurant.openingHours.openingTime}
          </Badge>
        </div>
      </div>
    </button>
  );
}

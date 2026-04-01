import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";
import MenuCategorySection from "../components/menu/MenuCategorySection";
import MenuFilters from "../components/menu/MenuFilters";
import { useMenu } from "../hooks/useMenu";
import { useMenuFilters } from "../hooks/useMenuFilters";
import { useRestaurants } from "../hooks/useRestaurants";
import { getMockRating } from "../utils/mockRating";

const SKELETON_ROWS = ["r1", "r2", "r3"];
const SKELETON_ITEMS = ["i1", "i2", "i3", "i4"];

export default function MenuPage() {
  const params = useParams({ strict: false }) as { restaurantId?: string };
  const restaurantId = params.restaurantId ?? "";

  const navigate = useNavigate();
  const { data: menuItems, isLoading: isLoadingMenu } = useMenu(restaurantId);
  const { data: restaurants } = useRestaurants();

  const restaurant = restaurants?.find((r) => r.id === restaurantId);
  const rating = restaurant ? getMockRating(restaurant.id) : 4.5;

  const {
    selectedCategories,
    showAvailableOnly,
    toggleCategory,
    toggleAvailableOnly,
    filteredItems,
  } = useMenuFilters(menuItems || []);

  if (isLoadingMenu || !restaurants) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-40 w-full rounded-xl mb-8" />
        <div className="space-y-8">
          {SKELETON_ROWS.map((rowId) => (
            <div key={rowId} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKELETON_ITEMS.map((itemId) => (
                  <Skeleton key={`${rowId}-${itemId}`} className="h-40" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          Restaurant not found
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b">
        <div className="container py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/restaurants" })}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurants
          </Button>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img
                src={
                  restaurant.logoUrl ||
                  "/assets/generated/restaurant-placeholder.dim_200x200.png"
                }
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/generated/restaurant-placeholder.dim_200x200.png";
                }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {restaurant.name}
              </h1>
              <p className="text-muted-foreground text-sm mb-3">
                {restaurant.cuisineType.charAt(0).toUpperCase() +
                  restaurant.cuisineType.slice(1)}{" "}
                Cuisine
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">(200+ ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    25-35 mins delivery • {Number(restaurant.avgPrepTime)} mins
                    prep
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <MenuFilters
          selectedCategories={selectedCategories}
          showAvailableOnly={showAvailableOnly}
          onToggleCategory={toggleCategory}
          onToggleAvailableOnly={toggleAvailableOnly}
        />
        <div className="mt-8 space-y-12">
          <MenuCategorySection
            restaurantId={restaurantId}
            items={filteredItems}
          />
        </div>
      </div>
    </div>
  );
}

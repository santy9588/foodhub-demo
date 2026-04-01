import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChefHat, Plus, Settings, Star, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useRestaurants } from "../hooks/useRestaurants";
import { getMockRating } from "../utils/mockRating";

const MY_SKELETONS = ["ms1", "ms2", "ms3"];

export default function MyRestaurantsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { data: restaurants, isLoading } = useRestaurants();

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center max-w-md mx-auto">
        <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your restaurants
        </p>
        <Button onClick={login} data-ocid="login.button">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Restaurants
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your registered restaurants
              </p>
            </div>
            <Link to="/register-restaurant">
              <Button
                className="bg-primary text-white"
                data-ocid="add-restaurant.primary_button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Restaurant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="space-y-4">
            {MY_SKELETONS.map((id) => (
              <Skeleton
                key={id}
                className="h-28 w-full rounded-xl"
                data-ocid="myrestaurants.loading_state"
              />
            ))}
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div className="space-y-4">
            {restaurants.map((r, i) => {
              const rating = getMockRating(r.id);
              const position = i + 1;
              return (
                <div
                  key={r.id}
                  className="bg-card rounded-xl p-5 shadow-card flex items-center gap-4"
                  data-ocid={`myrestaurants.item.${position}`}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={
                        r.logoUrl ||
                        "/assets/generated/restaurant-placeholder.dim_200x200.png"
                      }
                      alt={r.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/generated/restaurant-placeholder.dim_200x200.png";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">
                      {r.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{r.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {r.cuisineType.charAt(0).toUpperCase() +
                          r.cuisineType.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: "/manage-menu/$restaurantId",
                          params: { restaurantId: r.id },
                        })
                      }
                      data-ocid={`myrestaurants.edit_button.${position}`}
                    >
                      <ChefHat className="mr-1 h-3.5 w-3.5" />
                      Menu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: "/restaurant/$restaurantId",
                          params: { restaurantId: r.id },
                        })
                      }
                      data-ocid={`myrestaurants.secondary_button.${position}`}
                    >
                      <Settings className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-20"
            data-ocid="myrestaurants.empty_state"
          >
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-2">
              No restaurants yet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Register your first restaurant to get started
            </p>
            <Link to="/register-restaurant">
              <Button data-ocid="register.primary_button">
                <Plus className="mr-2 h-4 w-4" />
                Register Restaurant
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

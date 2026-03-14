import { useRestaurants } from '../hooks/useRestaurants';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantsPage() {
  const { data: restaurants, isLoading } = useRestaurants();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-food.dim_1200x400.png"
          alt="Delicious food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground drop-shadow-lg">
              Delicious Food, Delivered Fast
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 drop-shadow">
              Order from your favorite restaurants
            </p>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="container py-12">
        <h2 className="font-display text-3xl font-bold mb-8">Available Restaurants</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}

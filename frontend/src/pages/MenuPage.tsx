import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenu } from '../hooks/useMenu';
import { useRestaurants } from '../hooks/useRestaurants';
import MenuFilters from '../components/menu/MenuFilters';
import MenuCategorySection from '../components/menu/MenuCategorySection';
import { useMenuFilters } from '../hooks/useMenuFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuPage() {
  const { restaurantId } = useParams({ from: '/menu/$restaurantId' });
  const navigate = useNavigate();
  const { data: menuItems, isLoading: isLoadingMenu } = useMenu(restaurantId);
  const { data: restaurants } = useRestaurants();

  const restaurant = restaurants?.find((r) => r.id === restaurantId);

  const { selectedCategories, showAvailableOnly, toggleCategory, toggleAvailableOnly, filteredItems } =
    useMenuFilters(menuItems || []);

  if (isLoadingMenu) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-32" />
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
        <p className="text-muted-foreground">Restaurant not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Restaurant Header */}
      <section className="bg-background border-b">
        <div className="container py-8">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurants
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground">
                {restaurant.cuisineType.charAt(0).toUpperCase() + restaurant.cuisineType.slice(1)} Cuisine
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="container py-8">
        <MenuFilters
          selectedCategories={selectedCategories}
          showAvailableOnly={showAvailableOnly}
          onToggleCategory={toggleCategory}
          onToggleAvailableOnly={toggleAvailableOnly}
        />

        <div className="mt-8 space-y-12">
          <MenuCategorySection restaurantId={restaurantId} items={filteredItems} />
        </div>
      </section>
    </div>
  );
}

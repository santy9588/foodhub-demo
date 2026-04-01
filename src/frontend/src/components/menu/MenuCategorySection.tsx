import type { FoodType, MenuItem } from "../../backend";
import MenuItemCard from "./MenuItemCard";

interface MenuCategorySectionProps {
  restaurantId: string;
  items: MenuItem[];
}

const CATEGORY_LABELS: Record<FoodType, string> = {
  veg: "Vegetarian",
  nonVeg: "Non-Vegetarian",
  beverage: "Beverages",
  dessert: "Desserts",
  snack: "Snacks",
};

export default function MenuCategorySection({
  restaurantId,
  items,
}: MenuCategorySectionProps) {
  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.foodType]) {
        acc[item.foodType] = [];
      }
      acc[item.foodType].push(item);
      return acc;
    },
    {} as Record<FoodType, MenuItem[]>,
  );

  const categories = Object.keys(itemsByCategory) as FoodType[];

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No menu items match your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="font-display text-2xl font-bold">
            {CATEGORY_LABELS[category]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itemsByCategory[category].map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                restaurantId={restaurantId}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

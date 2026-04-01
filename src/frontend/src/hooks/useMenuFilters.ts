import { useMemo, useState } from "react";
import type { FoodType, MenuItem } from "../backend";

export function useMenuFilters(items: MenuItem[]) {
  const [selectedCategories, setSelectedCategories] = useState<Set<FoodType>>(
    new Set(),
  );
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const toggleCategory = (category: FoodType) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleAvailableOnly = () => {
    setShowAvailableOnly((prev) => !prev);
  };

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (selectedCategories.size > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.has(item.foodType),
      );
    }

    if (showAvailableOnly) {
      filtered = filtered.filter((item) => item.available);
    }

    return filtered;
    // biome-ignore lint/correctness/useExhaustiveDependencies: selectedCategories is a Set reference that changes
  }, [items, selectedCategories, showAvailableOnly]);

  return {
    selectedCategories,
    showAvailableOnly,
    toggleCategory,
    toggleAvailableOnly,
    filteredItems,
  };
}

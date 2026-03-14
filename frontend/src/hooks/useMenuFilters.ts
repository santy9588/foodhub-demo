import { useState, useMemo } from 'react';
import type { MenuItem, FoodType } from '../backend';

export function useMenuFilters(items: MenuItem[]) {
  const [selectedCategories, setSelectedCategories] = useState<Set<FoodType>>(new Set());
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
      filtered = filtered.filter((item) => selectedCategories.has(item.foodType));
    }

    // Note: Backend doesn't have availability field, so this is a placeholder
    // In a real app, you'd filter based on item.available or similar

    return filtered;
  }, [items, selectedCategories, showAvailableOnly]);

  return {
    selectedCategories,
    showAvailableOnly,
    toggleCategory,
    toggleAvailableOnly,
    filteredItems,
  };
}

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FoodType } from '../../backend';

interface MenuFiltersProps {
  selectedCategories: Set<FoodType>;
  showAvailableOnly: boolean;
  onToggleCategory: (category: FoodType) => void;
  onToggleAvailableOnly: () => void;
}

const CATEGORIES = [
  { value: FoodType.veg, label: 'Vegetarian' },
  { value: FoodType.nonVeg, label: 'Non-Veg' },
  { value: FoodType.beverage, label: 'Beverages' },
  { value: FoodType.dessert, label: 'Desserts' },
  { value: FoodType.snack, label: 'Snacks' },
];

export default function MenuFilters({
  selectedCategories,
  showAvailableOnly,
  onToggleCategory,
  onToggleAvailableOnly,
}: MenuFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.has(category.value);
          return (
            <Badge
              key={category.value}
              variant={isSelected ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => onToggleCategory(category.value)}
            >
              {category.label}
            </Badge>
          );
        })}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="available-only" checked={showAvailableOnly} onCheckedChange={onToggleAvailableOnly} />
        <Label htmlFor="available-only" className="cursor-pointer">
          Show available items only
        </Label>
      </div>
    </div>
  );
}

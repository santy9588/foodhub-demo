import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Store, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useRegisterRestaurant } from '../hooks/useRestaurants';
import { CuisineType } from '../backend';
import { toast } from 'sonner';

export default function RegisterRestaurantPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const registerMutation = useRegisterRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    logoUrl: '',
    cuisineType: '' as CuisineType | '',
    openingTime: '10:00 AM',
    closingTime: '10:00 PM',
    avgPrepTime: '30',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.cuisineType) {
      newErrors.cuisineType = 'Cuisine type is required';
    }
    if (!formData.avgPrepTime || Number(formData.avgPrepTime) <= 0) {
      newErrors.avgPrepTime = 'Average prep time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      const restaurant = await registerMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        logoUrl: formData.logoUrl || '/assets/generated/restaurant-placeholder.dim_200x200.png',
        cuisineType: formData.cuisineType as CuisineType,
        openingHours: {
          openingTime: formData.openingTime,
          closingTime: formData.closingTime,
        },
        avgPrepTime: BigInt(formData.avgPrepTime),
      });

      toast.success('Restaurant registered successfully!');
      navigate({ to: '/manage-menu/$restaurantId', params: { restaurantId: restaurant.id } });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register restaurant');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to register a restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
        <img
          src="/assets/generated/restaurant-register-banner.dim_1200x400.png"
          alt="Register Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Store className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="font-display text-4xl font-bold">Register Your Restaurant</h1>
            <p className="text-muted-foreground mt-2">Join FoodHub and reach more customers</p>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant Details</CardTitle>
            <CardDescription>Fill in the information about your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pasta Palace"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 123 Main Street, City"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-muted-foreground">Leave empty to use default placeholder</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type *</Label>
                <Select
                  value={formData.cuisineType}
                  onValueChange={(value) => setFormData({ ...formData, cuisineType: value as CuisineType })}
                >
                  <SelectTrigger id="cuisineType">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cuisineType && <p className="text-sm text-destructive">{errors.cuisineType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    placeholder="10:00 AM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    placeholder="10:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgPrepTime">Average Preparation Time (minutes) *</Label>
                <Input
                  id="avgPrepTime"
                  type="number"
                  min="1"
                  value={formData.avgPrepTime}
                  onChange={(e) => setFormData({ ...formData, avgPrepTime: e.target.value })}
                  placeholder="30"
                />
                {errors.avgPrepTime && <p className="text-sm text-destructive">{errors.avgPrepTime}</p>}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Restaurant'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

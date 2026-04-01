# FoodHub - India Food Ordering Platform

## Current State
An existing food ordering demo app with:
- Restaurant listing and registration
- Menu management with item upload
- Cart and order placement
- Order history
- Internet Identity authentication
- Backend APIs: getRestaurants, registerRestaurant, addMenuItem, placeOrder, getOrderHistory, etc.

## Requested Changes (Diff)

### Add
- Enhanced restaurant registration with FSSAI license, GST number, business type, service radius, city/state fields
- Vendor portal: separate dashboard where registered vendors can log in, view orders, manage their menu, update item availability
- Admin dashboard: view all restaurants, all orders, manage users/vendors
- Homepage with hero section, cuisine category filters, featured restaurants grid
- Ratings and reviews on restaurant cards (mock stars)
- Offers/badges (FREE DELIVERY, NEW, POPULAR) on restaurant cards
- Search and filter by cuisine type, food type (veg/non-veg), category
- Order status page with mock preparation/delivery status flow
- Mobile-responsive design throughout

### Modify
- Redesign full UI to match design preview: orange brand (#FF6A2A), dark header (#2B2F33), white cards, light gray background
- Improve restaurant cards to show cuisine, rating, delivery time, free delivery badge
- Improve menu page layout with category grouping and food type filters
- Better navigation with Home, Restaurants, Offers, Account, Cart

### Remove
- Nothing removed, only enhanced

## Implementation Plan
1. Regenerate backend with enhanced restaurant fields (FSSAI, GST, business type, city, state, service radius) and vendor role
2. Build new frontend:
   - Homepage with hero, category strip, featured restaurants grid
   - Restaurant listing page with search/filters
   - Restaurant menu page with category grouping
   - Register restaurant page with full business details
   - Vendor dashboard (manage menu, view incoming orders)
   - Admin dashboard (all restaurants, all orders)
   - Cart drawer and checkout flow
   - Order history and status page
3. Apply design system: orange accent, dark header/footer, card-based layout, soft shadows

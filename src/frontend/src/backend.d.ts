import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface MenuItemInputWithAvailability {
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    prepTime: bigint;
    category: string;
    price: bigint;
    foodType: FoodType;
}
export interface RestaurantInput {
    name: string;
    cuisineType: CuisineType;
    logoUrl: string;
    address: string;
    openingHours: OpeningHours;
    avgPrepTime: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    user: Principal;
    timestamp: Time;
    items: Array<CartItem>;
    totalPrice: bigint;
    restaurant: Restaurant;
}
export interface Restaurant {
    id: string;
    menu: Array<MenuItem>;
    name: string;
    cuisineType: CuisineType;
    logoUrl: string;
    address: string;
    openingHours: OpeningHours;
    avgPrepTime: bigint;
}
export interface OpeningHours {
    openingTime: string;
    closingTime: string;
}
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    prepTime: bigint;
    category: string;
    price: bigint;
    foodType: FoodType;
}
export interface Cart {
    total: bigint;
    platformFee: bigint;
    deliveryCharges: bigint;
    items: Array<CartItem>;
    subtotal: bigint;
}
export interface CartItem {
    item: MenuItem;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum CuisineType {
    mediterranean = "mediterranean",
    japanese = "japanese",
    chinese = "chinese",
    mexican = "mexican",
    italian = "italian",
    indian = "indian",
    american = "american"
}
export enum FoodType {
    veg = "veg",
    dessert = "dessert",
    nonVeg = "nonVeg",
    snack = "snack",
    beverage = "beverage"
}
export enum OrderStatus {
    preparing = "preparing",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(restaurantId: string, itemInput: MenuItemInputWithAvailability): Promise<MenuItem>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateCart(items: Array<CartItem>): Promise<Cart>;
    filterMenuByFoodType(restaurantId: string, foodType: FoodType): Promise<Array<MenuItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: string): Promise<Order | null>;
    getOrderHistory(): Promise<Array<Order>>;
    getRestaurantById(restaurantId: string): Promise<Restaurant | null>;
    getRestaurantMenu(restaurantId: string): Promise<Array<MenuItem>>;
    getRestaurants(): Promise<Array<Restaurant>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initSampleData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(restaurantId: string, items: Array<CartItem>): Promise<string>;
    registerRestaurant(input: RestaurantInput): Promise<Restaurant>;
    resyncOrderStatuses(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
}

import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Restaurant Types
  type CuisineType = {
    #italian;
    #indian;
    #chinese;
    #mexican;
    #american;
    #japanese;
    #mediterranean;
  };

  type FoodType = {
    #veg;
    #nonVeg;
    #beverage;
    #dessert;
    #snack;
  };

  module FoodType {
    public func compare(ft1 : FoodType, ft2 : FoodType) : Order.Order {
      let toNumber = func(ft : FoodType) : Nat {
        switch (ft) {
          case (#veg) { 0 };
          case (#nonVeg) { 1 };
          case (#beverage) { 2 };
          case (#dessert) { 3 };
          case (#snack) { 4 };
        };
      };
      Nat.compare(toNumber(ft1), toNumber(ft2));
    };
  };

  type OpeningHours = {
    openingTime : Text;
    closingTime : Text;
  };

  type Restaurant = {
    id : Text;
    name : Text;
    address : Text;
    logoUrl : Text;
    cuisineType : CuisineType;
    openingHours : OpeningHours;
    avgPrepTime : Nat;
    menu : [MenuItem];
  };

  module Restaurant {
    public func compare(r1 : Restaurant, r2 : Restaurant) : Order.Order {
      Text.compare(r1.id, r2.id);
    };
  };

  type MenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    foodType : FoodType;
    prepTime : Nat;
    available : Bool;
    imageUrl : Text;
  };

  type CartItem = {
    item : MenuItem;
    quantity : Nat;
  };

  type Cart = {
    items : [CartItem];
    subtotal : Nat;
    platformFee : Nat;
    deliveryCharges : Nat;
    total : Nat;
  };

  type OrderStatus = {
    #confirmed;
    #preparing;
    #outForDelivery;
    #delivered;
  };

  type Order = {
    id : Text;
    user : Principal;
    restaurant : Restaurant;
    items : [CartItem];
    totalPrice : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  let restaurants = Map.empty<Text, Restaurant>();
  let orders = Map.empty<Text, Order>();
  var orderCounter = 0;

  public shared ({ caller }) func initSampleData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize sample data");
    };

    if (restaurants.size() > 0) {
      return;
    };

    let sampleRestaurants = [
      {
        id = "r1";
        name = "Pasta Palace";
        address = "123 Main St";
        logoUrl = "https://example.com/pasta_palace_logo.png";
        cuisineType = #italian;
        openingHours = { openingTime = "10:00 AM"; closingTime = "10:00 PM" };
        avgPrepTime = 20;
        menu = [
          {
            id = "m1";
            name = "Spaghetti Carbonara";
            description = "Classic Italian pasta with creamy sauce";
            price = 1200;
            category = "main";
            foodType = #nonVeg;
            prepTime = 25;
            available = true;
            imageUrl = "https://example.com/spaghetti_carbonara.png";
          },
          {
            id = "m2";
            name = "Margherita Pizza";
            description = "Thin crust pizza with tomato and mozzarella";
            price = 1000;
            category = "main";
            foodType = #veg;
            prepTime = 20;
            available = true;
            imageUrl = "https://example.com/margherita_pizza.png";
          },
        ];
      },
      {
        id = "r2";
        name = "Curry Corner";
        address = "456 Elm St";
        logoUrl = "https://example.com/curry_corner_logo.png";
        cuisineType = #indian;
        openingHours = { openingTime = "11:00 AM"; closingTime = "11:00 PM" };
        avgPrepTime = 30;
        menu = [
          {
            id = "m3";
            name = "Butter Chicken";
            description = "Creamy tomato-based chicken curry";
            price = 1500;
            category = "main";
            foodType = #nonVeg;
            prepTime = 35;
            available = true;
            imageUrl = "https://example.com/butter_chicken.png";
          },
          {
            id = "m4";
            name = "Paneer Tikka";
            description = "Grilled cottage cheese with spices";
            price = 1200;
            category = "starter";
            foodType = #veg;
            prepTime = 25;
            available = true;
            imageUrl = "https://example.com/paneer_tikka.png";
          },
        ];
      },
    ];

    for (restaurant in sampleRestaurants.values()) {
      restaurants.add(restaurant.id, restaurant);
    };
  };

  type RestaurantInput = {
    name : Text;
    address : Text;
    logoUrl : Text;
    cuisineType : CuisineType;
    openingHours : OpeningHours;
    avgPrepTime : Nat;
  };

  type MenuItemInput = {
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    foodType : FoodType;
    prepTime : Nat;
    imageUrl : Text;
  };

  type MenuItemInputWithAvailability = {
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    foodType : FoodType;
    prepTime : Nat;
    available : Bool;
    imageUrl : Text;
  };

  public shared ({ caller }) func registerRestaurant(input : RestaurantInput) : async Restaurant {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register restaurants");
    };

    let restaurantId = "rest-" # Time.now().toText();
    let newRestaurant : Restaurant = {
      id = restaurantId;
      name = input.name;
      address = input.address;
      logoUrl = input.logoUrl;
      cuisineType = input.cuisineType;
      openingHours = input.openingHours;
      avgPrepTime = input.avgPrepTime;
      menu = [];
    };
    restaurants.add(restaurantId, newRestaurant);
    newRestaurant;
  };

  public shared ({ caller }) func addMenuItem(restaurantId : Text, itemInput : MenuItemInputWithAvailability) : async MenuItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    let currentRestaurant = restaurants.get(restaurantId);
    switch (currentRestaurant) {
      case (null) {
        Runtime.trap("Restaurant not found");
      };
      case (?restaurant) {
        let menuItemId = "menu-" # Time.now().toText();
        let newMenuItem : MenuItem = {
          id = menuItemId;
          name = itemInput.name;
          description = itemInput.description;
          price = itemInput.price;
          category = itemInput.category;
          foodType = itemInput.foodType;
          prepTime = itemInput.prepTime;
          available = itemInput.available;
          imageUrl = itemInput.imageUrl;
        };
        let updatedMenu = restaurant.menu.concat([newMenuItem]);
        let updatedRestaurant = { restaurant with menu = updatedMenu };
        restaurants.add(restaurantId, updatedRestaurant);
        newMenuItem;
      };
    };
  };

  public query ({ caller }) func getRestaurants() : async [Restaurant] {
    restaurants.values().toArray().sort();
  };

  public query ({ caller }) func getRestaurantMenu(restaurantId : Text) : async [MenuItem] {
    switch (restaurants.get(restaurantId)) {
      case (null) { [] };
      case (?restaurant) { restaurant.menu };
    };
  };

  public query ({ caller }) func calculateCart(items : [CartItem]) : async Cart {
    var subtotal = 0;
    var platformFee = 50;
    var deliveryCharges = 100;

    for (cartItem in items.values()) {
      subtotal += cartItem.item.price * cartItem.quantity;
    };

    let total = subtotal + platformFee + deliveryCharges;

    {
      items;
      subtotal;
      platformFee;
      deliveryCharges;
      total;
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    orders.entries()
    .filter(
      func((_, order)) {
        order.user == caller;
      }
    )
    .map(func((_, order)) { order })
    .toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder = { order with status = newStatus };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Users can only see their own orders, admins can see all
        if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func filterMenuByFoodType(restaurantId : Text, foodType : FoodType) : async [MenuItem] {
    switch (restaurants.get(restaurantId)) {
      case (null) {
        [];
      };
      case (?restaurant) {
        restaurant.menu.filter(
          func(item) {
            item.foodType == foodType;
          }
        );
      };
    };
  };

  public shared ({ caller }) func resyncOrderStatuses() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can resync order statuses");
    };

    let newOrders = Map.empty<Text, Order>();

    for ((orderId, order) in orders.entries()) {
      let updatedStatus = switch (order.status) {
        case (#confirmed) { #preparing };
        case (#preparing) { #outForDelivery };
        case (#outForDelivery) { #delivered };
        case (#delivered) { #delivered };
      };
      let updatedOrder = { order with status = updatedStatus };
      newOrders.add(orderId, updatedOrder);
    };

    orders.clear();
    for ((orderId, order) in newOrders.entries()) {
      orders.add(orderId, order);
    };
  };

  public shared ({ caller }) func placeOrder(restaurantId : Text, items : [CartItem]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    switch (restaurants.get(restaurantId)) {
      case (null) {
        Runtime.trap("Restaurant not found");
      };
      case (?restaurant) {
        var totalPrice = 0;
        for (cartItem in items.values()) {
          totalPrice += cartItem.item.price * cartItem.quantity;
        };

        let orderId = "ORD-" # orderCounter.toText();
        let newOrder : Order = {
          id = orderId;
          user = caller;
          restaurant;
          items;
          totalPrice;
          status = #confirmed;
          timestamp = Time.now();
        };

        orders.add(orderId, newOrder);
        orderCounter += 1;
        orderId;
      };
    };
  };

  public query ({ caller }) func getRestaurantById(restaurantId : Text) : async ?Restaurant {
    restaurants.get(restaurantId);
  };
};

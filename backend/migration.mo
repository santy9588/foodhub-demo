import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

module {
  // Old types definitions
  type OldRestaurant = {
    id : Text;
    name : Text;
    logoUrl : Text;
    cuisineType : {
      #italian;
      #indian;
      #chinese;
      #mexican;
      #american;
      #japanese;
      #mediterranean;
    };
    openingHours : {
      openingTime : Text;
      closingTime : Text;
    };
    avgPrepTime : Nat;
    menu : [OldMenuItem];
  };

  type OldMenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    prepTime : Nat;
    foodType : {
      #veg;
      #nonVeg;
      #beverage;
      #dessert;
      #snack;
    };
  };

  type OldCartItem = {
    item : OldMenuItem;
    quantity : Nat;
  };

  type OldOrder = {
    id : Text;
    user : Principal;
    restaurant : OldRestaurant;
    items : [OldCartItem];
    totalPrice : Nat;
    status : {
      #confirmed;
      #preparing;
      #outForDelivery;
      #delivered;
    };
    timestamp : Int;
  };

  // New types definitions
  type NewMenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    foodType : {
      #veg;
      #nonVeg;
      #beverage;
      #dessert;
      #snack;
    };
    prepTime : Nat;
    available : Bool;
    imageUrl : Text;
  };

  type NewRestaurant = {
    id : Text;
    name : Text;
    address : Text;
    logoUrl : Text;
    cuisineType : {
      #italian;
      #indian;
      #chinese;
      #mexican;
      #american;
      #japanese;
      #mediterranean;
    };
    openingHours : {
      openingTime : Text;
      closingTime : Text;
    };
    avgPrepTime : Nat;
    menu : [NewMenuItem];
  };

  type NewCartItem = {
    item : NewMenuItem;
    quantity : Nat;
  };

  type NewOrder = {
    id : Text;
    user : Principal;
    restaurant : NewRestaurant;
    items : [NewCartItem];
    totalPrice : Nat;
    status : {
      #confirmed;
      #preparing;
      #outForDelivery;
      #delivered;
    };
    timestamp : Int;
  };

  type OldActor = {
    restaurants : Map.Map<Text, OldRestaurant>;
    orders : Map.Map<Text, OldOrder>;
  };

  type NewActor = {
    restaurants : Map.Map<Text, NewRestaurant>;
    orders : Map.Map<Text, NewOrder>;
  };

  // Conversion helpers
  func convertMenuItem(oldMenuItem : OldMenuItem) : NewMenuItem {
    {
      oldMenuItem with
      category = "main";
      available = true;
      imageUrl = "https://default-image.com";
    };
  };

  func convertRestaurant(oldRestaurant : OldRestaurant) : NewRestaurant {
    {
      oldRestaurant with
      address = "Unknown Address";
      menu = oldRestaurant.menu.map(convertMenuItem);
    };
  };

  func convertCartItem(oldCartItem : OldCartItem) : NewCartItem {
    {
      oldCartItem with
      item = convertMenuItem(oldCartItem.item);
    };
  };

  func convertOrder(oldOrder : OldOrder) : NewOrder {
    {
      oldOrder with
      restaurant = convertRestaurant(oldOrder.restaurant);
      items = oldOrder.items.map(convertCartItem);
    };
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newRestaurants = old.restaurants.map<Text, OldRestaurant, NewRestaurant>(
      func(_id, oldRestaurant) {
        convertRestaurant(oldRestaurant);
      }
    );
    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        convertOrder(oldOrder);
      }
    );
    {
      restaurants = newRestaurants;
      orders = newOrders;
    };
  };
};

import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage {
  notifications = [
    {
      title: "Thursday’s Feast Awaits!",
      message: "Your Exotic Veggie Platter is on the menu. Get excited!",
      time: "2 days ago",
      icon: "restaurant-outline"
    },
    {
      title: "Meal Kit En Route!",
      message: "Today’s the day. Your culinary adventure is almost there.",
      time: "6 days ago",
      icon: "fast-food-outline"
    },
    {
      title: "Tomorrow’s Treats!",
      message: "Last chance to add a little extra to your Tuesday delivery.",
      time: "9 days ago",
      icon: "gift-outline"
    },
    {
      title: "Order Tweaked!",
      message: "Added Gourmet Cheese to your kit. Next week just got tastier!",
      time: "13 days ago",
      icon: "leaf-outline"
    },
    {
      title: "Fresh Flavors Unveiled!",
      message: "New menu items are in! What will you try next?",
      time: "1 week ago",
      icon: "sparkles-outline"
    },
    {
      title: "Taste Satisfaction?",
      message: "Tell us how the Veggie Platter did on the flavor front!",
      time: "1 week ago",
      icon: "star-outline"
    },
    {
      title: "Weekend Bonus!",
      message: "Get 10% off on a surprise side for your next order. Yum!",
      time: "11 days ago",
      icon: "pricetag-outline"
    },
    {
      title: "Delivery Day!",
      message: "Your meal kit, now with extra freshness, has arrived.",
      time: "2 weeks ago",
      icon: "cube-outline"
    }
  ];

  constructor() {}
}

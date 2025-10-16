import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './../services/notification'; // adjust path

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.page.html',
  styleUrls: ['./admin-menu.page.scss'],
})
export class AdminMenuPage implements OnInit {
  firstName: string = 'Admin'; // default fallback
  notificationsCount: number = 0;

  constructor(
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    // Read firstName from localStorage
    const storedName = localStorage.getItem('firstName');
    if (storedName) {
      this.firstName = storedName;
    }

    // Subscribe to unread notifications count
    this.notifService.unreadCount$.subscribe((count: number) => {
      this.notificationsCount = count;
    });
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}

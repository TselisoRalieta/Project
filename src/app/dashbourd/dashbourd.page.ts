import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './../services/notification';

@Component({
  selector: 'app-dashbourd',
  templateUrl: './dashbourd.page.html',
  styleUrls: ['./dashbourd.page.scss'],
  standalone: false,
})
export class DashbourdPage implements OnInit {
  firstName: string = 'User';
  notificationsCount: number = 0;

  constructor(
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    // ✅ Get firstName from localStorage (already only first name)
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

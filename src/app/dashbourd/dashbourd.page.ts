import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { NotificationService } from './../services/notification'; // adjust path

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
    private db: AngularFireDatabase, 
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
  // Subscribe to unread notifications count
  this.notifService.unreadCount$.subscribe((count: number) => {
    this.notificationsCount = count;
  });
}

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}

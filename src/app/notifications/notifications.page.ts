import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from './../services/notification'; // adjust path

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {

  notifications: any[] = [];

  constructor(
    private db: AngularFireDatabase, 
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.db.list('notifications').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => {
          const data = c.payload.val() as any;
          return {
            key: c.payload.key,
            title: data.title || 'No Title',
            description: data.description || '',
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            type: data.type ? data.type.trim().toLowerCase() : '',
            viewed: data.viewed || false
          };
        })
      )
    ).subscribe(data => {
      this.notifications = data
        .filter(n => n.title || n.description)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      console.log('Loaded notifications:', this.notifications);
    });
  }

  // Mark notification as viewed and update unread count
  markAsViewed(notif: any) {
    if (!notif.key || notif.viewed) return;
    this.db.object(`notifications/${notif.key}`).update({ viewed: true })
      .then(() => {
        notif.viewed = true;
        this.notifService.markAsViewed(notif.key);
      })
      .catch(err => console.error('Error marking viewed:', err));
  }

  // Navigate and mark as viewed
  navigateNotification(notif: any) {
    this.markAsViewed(notif);
    const route = this.getRoute(notif);
    if (route) this.router.navigate([route]);
  }

  // Determine icon based on type or title keywords
  getIcon(notif: any): string {
    if (!notif) return 'notifications-outline';
    let type = notif.type || '';
    if (!type) {
      const text = ((notif.title || '') + ' ' + (notif.description || '')).toLowerCase();
      if (text.includes('hazard')) type = 'hazard';
      else if (text.includes('blog') || text.includes('post')) type = 'blog';
      else if (text.includes('weather') || text.includes('rain') || text.includes('storm')) type = 'weather';
      else type = 'unknown';
    }
    switch (type.toLowerCase()) {
      case 'hazard': return 'warning-outline';
      case 'blog': return 'newspaper-outline';
      case 'weather': return 'cloud-outline';
      default: return 'notifications-outline';
    }
  }

  // Determine route based on type or title keywords
  getRoute(notif: any): string {
    if (!notif) return '';
    let type = notif.type || '';
    if (!type) {
      const text = ((notif.title || '') + ' ' + (notif.description || '')).toLowerCase();
      if (text.includes('hazard')) type = 'hazard';
      else if (text.includes('blog') || text.includes('post')) type = 'blog';
      else if (text.includes('weather') || text.includes('rain') || text.includes('storm')) type = 'weather';
      else type = 'unknown';
    }
    switch (type.toLowerCase()) {
      case 'blog': return '/updates';
      case 'hazard': return '/road-status';
      case 'weather': return '/weather';
      default: return '';
    }
  }
}

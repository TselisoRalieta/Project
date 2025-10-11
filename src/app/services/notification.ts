import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(private db: AngularFireDatabase) {
    this.updateUnreadCount();
  }

  // Fetch unread notifications count from Firebase
  updateUnreadCount() {
    this.db.list('notifications').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => {
          const data = c.payload.val() as any;
          return data.viewed ? true : false;
        })
      )
    ).subscribe(flags => {
      const count = flags.filter(v => v === false).length;
      this.unreadCount.next(count);
    });
  }

  // Call when a notification is viewed
  markAsViewed(notifKey: string) {
    if (!notifKey) return;
    this.db.object(`notifications/${notifKey}`).update({ viewed: true })
      .then(() => this.updateUnreadCount());
  }
}

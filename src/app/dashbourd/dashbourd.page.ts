import { Component, OnInit } from '@angular/core';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getDatabase, ref as dbRef, get } from 'firebase/database';

@Component({
  selector: 'app-dashbourd',
  templateUrl: './dashbourd.page.html',
  styleUrls: ['./dashbourd.page.scss'],
  standalone: false,
})
export class DashbourdPage implements OnInit {
  firstName: string = 'User'; // Default name used for now

  constructor() {}

  ngOnInit() {
    // Firebase logic is temporarily disabled for frontend development only

    /*
    const auth = getAuth();
    const db = getDatabase();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = dbRef(db, 'users/' + user.uid);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            this.firstName = data.name || 'User';
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
    });
    */
  }
}

import { Component, OnInit } from '@angular/core';
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import { getDatabase, ref as dbRef, get } from 'firebase/database';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.page.html',
  styleUrls: ['./admin-account.page.scss'],
  standalone: false,
})
export class AdminAccountPage implements OnInit {
  // user: User | null = null;
  profileImageUrl: string = 'assets/images/images.png'; 
  fullName: string = 'Admin Name'; // Placeholder while DB is disabled
  userName: string = 'John';       // Static sample data
  userSurname: string = 'Doe';
  location: string = 'Nairobi, Kenya';
  email: string = 'admin@example.com'; // Static email
  phone: string = '+254712345678';

  constructor() {}

  ngOnInit() {
    // const auth = getAuth();
    // const db = getDatabase();

    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     this.user = user;
    //     this.email = user.email || '';

    //     const userRef = dbRef(db, 'users/' + user.uid);
    //     try {
    //       const snapshot = await get(userRef);
    //       if (snapshot.exists()) {
    //         const data = snapshot.val();
    //         this.userName = data.name || '';
    //         this.userSurname = data.surname || '';
    //         this.fullName = `${this.userName} ${this.userSurname}`;
    //         this.location = data.location || '';
    //         this.phone = data.phone || '';
    //       }
    //     } catch (error) {
    //       console.error('Failed to fetch admin data:', error);
    //     }
    //   }
    // });
  }
}

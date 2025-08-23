import { Component, OnInit } from '@angular/core';
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import { getDatabase, ref as dbRef, get } from 'firebase/database';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.page.html',
  styleUrls: ['./admin-menu.page.scss'],
  standalone: false,
})
export class AdminMenuPage implements OnInit {
  firstName: string = 'Admin'; 

  constructor() {}

  ngOnInit() {
    // const auth = getAuth(); // 🔹 Initialize Firebase authentication
    // const db = getDatabase(); // 🔹 Get a reference to the Firebase Realtime Database

    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     // 🔹 Create a database reference to the current user
    //     const userRef = dbRef(db, 'users/' + user.uid);
    //     try {
    //       // 🔹 Retrieve the user's data from the database
    //       const snapshot = await get(userRef);
    //       if (snapshot.exists()) {
    //         const data = snapshot.val(); // 🔹 Extract user data
    //         this.firstName = data.name || 'Admin'; // 🔹 Set first name from database or fallback
    //       }
    //     } catch (error) {
    //       console.error('Failed to fetch user data:', error); // 🔹 Log any database retrieval errors
    //     }
    //   }
    // });
  }
}

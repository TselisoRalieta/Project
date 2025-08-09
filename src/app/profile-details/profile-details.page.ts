import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, updateProfile, User } from 'firebase/auth';
// import { getDatabase, ref as dbRef, get } from 'firebase/database'; // 🔒 Commented for now – using frontend only
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
  standalone: false,
})
export class ProfileDetailsPage implements OnInit {
  user: User | null = null;
  profileImageUrl: string | null = null;
  userEmail: string = '';
  userName: string = '';
  userSurname: string = '';
  userPhone: string = '';
  userLocation: string = '';

  ngOnInit() {
    const auth = getAuth();
    // const database = getDatabase(); // 🔒 Database access is temporarily disabled

    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        this.user = currentUser;
        this.userEmail = currentUser.email || '';
        this.profileImageUrl = currentUser.photoURL || null;

        // 🔒 Fetching user profile data from Realtime Database is currently disabled
        /*
        const userRef = dbRef(database, 'users/' + currentUser.uid);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            this.userName = data.name || '';
            this.userSurname = data.surname || '';
            this.userPhone = data.phone || '';
            this.userLocation = data.location || '';
          } else {
            console.warn('No user data found in database.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        */
      }
    });
  }

  async uploadProfileImage(event: any) {
    const file = event.target.files[0];
    if (!file || !this.user) return;

    const storage = getStorage();
    const filePath = `profile-images/${this.user.uid}`;
    const fileRef = storageRef(storage, filePath);

    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await updateProfile(this.user, { photoURL: downloadURL });
      this.profileImageUrl = downloadURL;

      alert('Profile picture updated!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload profile picture.');
    }
  }
}

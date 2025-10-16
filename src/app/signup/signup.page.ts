import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      alert('Please fill in both email and password.');
      return;
    }

    try {
      // 1️⃣ Authenticate user
      const cred = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);

      // 2️⃣ Retrieve user data from Firebase Database
      const db = getDatabase();
      const userRef = ref(db, 'users/' + cred.user?.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        alert('User data not found.');
        return;
      }

      const userData = snapshot.val();
      const role = userData.role;

      // 3️⃣ Extract only first name from username
      let firstName = 'User';
      if (userData.username) {
        firstName = userData.username.split(' ')[0]; // Take first word only
      }

      // 4️⃣ Store firstName in localStorage
      localStorage.setItem('firstName', firstName);

      // 5️⃣ Redirect based on role
      if (role === 'admin') {
        this.router.navigate(['/admin-menu']);
      } else if (role === 'user') {
        this.router.navigate(['/dashbourd']);
      } else {
        alert('Unknown role. Please contact support.');
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        alert('Invalid email or password.');
      } else if (error.code === 'auth/user-not-found') {
        alert('No account found for this email.');
      } else {
        console.error('Login error:', error);
        alert(error.message || 'Login failed.');
      }
    }
  }
}

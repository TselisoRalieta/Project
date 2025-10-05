import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { from } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
  standalone: false, 
})
export class CreateAccountPage {
  showPassword = false;

  username = '';
  email = '';
  password = '';

  constructor(private afAuth: AngularFireAuth) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (!this.username || !this.email || !this.password) {
      alert('Please fill in all fields.');
      return;
    }

    const db = getDatabase();

    return from(
      this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          const userRef = ref(db, 'users/' + cred.user?.uid);
          return set(userRef, {
            uid: cred.user?.uid,
            username: this.username,
            email: this.email,
            role: 'user',
            createdAt: new Date().toISOString()
          });
        })
        .then(() => {
          alert('Account created successfully!');
          // Optionally redirect to login page
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert('This Email is already registered. Log in instead.');
          } else {
            alert(error.message || error);
            console.error('Registration failed:', error);
          }
        })
    );
  }
}

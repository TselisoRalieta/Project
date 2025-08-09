import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Uncomment and setup Firebase if you want backend auth
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { getDatabase, ref, get } from 'firebase/database';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false,
})
export class RegistrationPage {
  isLogin = true; // default to login form first

  showPassword = false;

  // Shared fields
  email = '';
  password = '';

  // Signup specific
  firstName = '';
  lastName = '';
  contacts = '';
  location = '';

  constructor(
    private router: Router,
    // private afAuth: AngularFireAuth,
    // private firestore: AngularFirestore
  ) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.resetFields();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetFields() {
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.contacts = '';
    this.location = '';
  }

  login() {
    // Implement your Firebase login or other logic here
    console.log('Login attempted with:', {
      email: this.email,
      password: this.password,
    });

    alert('Login submitted! (No backend logic for now)');
    // Navigate after login if needed
    // this.router.navigate(['/home']);
  }

  register() {
    // Implement your Firebase registration or other logic here
    console.log('Register attempted with:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      contacts: this.contacts,
      location: this.location,
    });

    alert('Registration submitted! (No backend logic for now)');
    // Optionally switch to login form after registration
    this.toggleForm();
  }
}
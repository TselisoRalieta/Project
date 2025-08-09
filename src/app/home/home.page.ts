import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  currentSlide = 0; // index of current slide (0,1,2)

  constructor(private router: Router) {}

  nextSlide() {
    if (this.currentSlide < 2) {
      this.currentSlide++;
    } else {
      this.finishOnboarding();
    }
  }

  finishOnboarding() {
    console.log('Onboarding finished!');
    this.router.navigate(['/main']); // Navigate to main page
  }

  skipOnboarding() {
    this.finishOnboarding();
  }
}

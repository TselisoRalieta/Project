import { Component, OnInit } from '@angular/core';
// If plugin doesn’t work in browser, fallback is added
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@Component({
  selector: 'app-contact-center',
  templateUrl: './contact-center.page.html',
  styleUrls: ['./contact-center.page.scss'],
  standalone: false,
})
export class ContactCenterPage implements OnInit {

  constructor(private callService: CallNumber) {}

  ngOnInit() {}

  makeCall(phoneNumber: string): void {
    if ((window as any).cordova) {
      this.callService.callNumber(phoneNumber, true)
        .then((res: any) => console.log('Launched dialer!', res))
        .catch((err: any) => console.log('Error launching dialer', err));
    } else {
      // Fallback for browser testing
      window.open(`tel:${phoneNumber}`, '_system');
    }
  }

}

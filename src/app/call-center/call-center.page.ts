import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.page.html',
  styleUrls: ['./call-center.page.scss'],
})
export class CallCenterPage implements OnInit {

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

import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from "ngx-device-detector";
import { AccountService } from "src/app/_services/account.service";
import { AlertService } from "src/app/_services/alert.service";

const malePassportPlaceholder = 'assets/images/african-svgrepo-com.svg';
const femalePassportPlaceholder = 'assets/images/african-woman-svgrepo-com.svg';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  busy = true;

  get passportSource() {
    if (this.user && this.user.passport) {
      return this.user.passport;
    }

    if (!this.user || this.user.gender.toLowerCase() === "male") {
      return malePassportPlaceholder;
    } else {
      return femalePassportPlaceholder;
    }
  }

  get user() {
    return this.account.user;
  }

  constructor(private account: AccountService, private alert: AlertService,
              public dv: DeviceDetectorService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.account.getUser().toPromise()
      .catch(err => {
        this.alert.error(err.error);
      }).finally(() => {
        this.busy = false;
      });
  }

}

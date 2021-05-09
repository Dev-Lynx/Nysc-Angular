import { Component, OnInit } from '@angular/core';
import { AccountService } from "src/app/_services/account.service";
import { AlertService } from "src/app/_services/alert.service";
import { DeviceService } from "src/app/_services/device.service";

const malePassportPlaceholder = 'assets/images/african-svgrepo-com.svg';
const femalePassportPlaceholder = 'assets/images/african-woman-svgrepo-com.svg';
const signaturePlaceholder = 'assets/images/pen-svgrepo-com.svg';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  busy = true;

  get passportSource() {
    if (this.user && this.user.passport) {
      return this.user.passport;
    }

    const gender = this.user.gender || "male";

    if (!this.user || gender.toLowerCase() === "male") {
      return malePassportPlaceholder;
    } else {
      return femalePassportPlaceholder;
    }
  }

  get signatureSource() {
    if (this.user && this.user.signature) {
      return this.user.signature;
    }

    return signaturePlaceholder;
  }

  get user() {
    return this.account.user;
  }

  constructor(private account: AccountService, private alert: AlertService,
              public dv: DeviceService) { }

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

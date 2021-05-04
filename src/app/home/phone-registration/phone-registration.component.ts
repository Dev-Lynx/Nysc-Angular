import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "src/app/_services/account.service";
import { AuthService } from "src/app/_services/auth.service";

@Component({
  selector: 'app-phone-registration',
  templateUrl: './phone-registration.component.html',
  styleUrls: ['./phone-registration.component.css']
})
export class PhoneRegistrationComponent implements OnInit {
  form = this.fb.group({
    phone: ['', Validators.compose([Validators.required,
      Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$')])]
  });
  
  get user() {
    return this.account.user;
  }

  get phone() { return this.form.get('phone'); }
  get canContinue() {
    return this.form.valid;
  }

  constructor(private fb: FormBuilder, private account: AccountService,
              private router: Router, private route: ActivatedRoute, private auth: AuthService) { }
  
  ngOnInit() {
    // throw new Error("Method not implemented.");
  }

  async ngAfterViewInit() {
    console.log("User is: ", this.user);

    if (!this.user) {
      await this.account.getUser()
        .toPromise()
        .catch(error => console.log(error));
    }
  }

  goBack() {
    this.router.navigate(["../"]);
  }

  continue() {
    if (!this.form.valid) {
      this.form.markAsDirty();
      return;
    }

    const phone = this.phone;

    if (phone) {
      this.account.user.phoneNumber = phone.value;
      console.log(this.account.user);
      
      if (this.auth.verificationSent) {
        this.auth.sendVerification(this.account.user.phoneNumber);
          // .subscribe(() => { this.activateTimer(); }, error => console.error(error));
      }

      this.router.navigate(["/login/phoneVerification"]);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ClrLoadingState} from '@clr/angular';
import { timeout } from 'rxjs/operators';
import {AccountService} from '../../_services/account.service';
import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from '../../_services/alert.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  form = this.fb.group({
    role: ['regularUser'],
    username: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
    password: ['', Validators.compose([Validators.required])],
    rememberMe: [false]
  });

  loaderActive = false;
  loaderMessage: string;

  credentialsInvalid = false;
  loginTimeout = false;
  serverError = false;
  adminError = false;
  loginLoadingState: ClrLoadingState = ClrLoadingState.DEFAULT;

  get role() { return this.form.get('role'); }
  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  /*

// ~~~`~
  get rememberMe() { return this.form.get('rememberMe'); }
  */

  baseUrl = environment.apiBase + 'auth/';


  constructor(private fb: FormBuilder, private router: Router,
              private auth: AuthService, private account: AccountService,
              private route: ActivatedRoute) {
    this.form.valueChanges.subscribe(() => {
      if (this.credentialsInvalid) {
        this.credentialsInvalid = false;
      }
      if (this.loginTimeout) {
        this.loginTimeout = false;
      }
      if (this.serverError) {
        this.serverError = false;
      }

      if (this.adminError) {
        this.adminError = false;
      }
    });
  }

  ngOnInit() {
  }

  async onSubmit() {
    this.loginLoadingState = ClrLoadingState.LOADING;

    if (!this.form.valid) {
      this.loginLoadingState = ClrLoadingState.ERROR;
      return;
    }

    if (!await this.login()) {
      return;
    }

    // TODO: Check for errors
    this.loaderMessage = 'Logging In...';
    this.loaderActive = true;
    await this.account.getUser().toPromise();
    this.loaderActive = false;

    const user = this.account.user;
    console.log(user);


    if (user.hasPhoneNumber === false) {
      await this.router.navigate(['linkPhone'], { relativeTo: this.route } );
    } else if (!user.phoneNumberConfirmed) {
      await this.router.navigate(['phoneVerification'], { relativeTo: this.route } );
    } else {
      await this.router.navigate(['dashboard']);
    }
  }


  private async login(): Promise<boolean> {
    let success = true;
    await this.auth.login(this.form.value).pipe(
      timeout(120000)
    ).toPromise().then(() => {
      this.loginLoadingState = ClrLoadingState.SUCCESS;
    }).catch((error) => {
      this.loginLoadingState = ClrLoadingState.ERROR;
      if (error.name === 'TimeoutError') {
        this.loginTimeout = true;
      } else if (error instanceof HttpErrorResponse) {
        const httpError = error as HttpErrorResponse;

        if (httpError.status === 401) {
          this.credentialsInvalid = true;
        } else {
          this.serverError = true;
        }
      } else {
        this.serverError = true;
      }

      console.log(error);
      success = false;
    });

    return success;
  }
}

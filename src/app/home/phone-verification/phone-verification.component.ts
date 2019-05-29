import {AfterViewInit, Component, OnInit} from '@angular/core';
import {timer} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../_services/auth.service';
import {Router} from '@angular/router';
import {AccountService} from '../../_services/account.service';
import {ClrLoadingState} from '@clr/angular';
import {User} from '../../_models/user';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.css']
})
export class PhoneVerificationComponent implements OnInit, AfterViewInit {
  user: User;
  timerDuration = 300;
  timerCheckpoint = 180;

  timeLeft = 300;
  timer: any;


  timerActive = false;
  checkpointActive = false;
  verificationFailed = false;

  form = this.fb.group({
    password: ['', Validators.compose([Validators.required,
      Validators.pattern('^[0-9]*$')])]
  });

  confirmationState: ClrLoadingState = ClrLoadingState.DEFAULT;

  get password() { return this.form.get('password'); }
  loaderActive: boolean;
  loaderMessage: string;

  constructor(private auth: AuthService, private fb: FormBuilder,
              private router: Router, private account: AccountService) {
    this.form.valueChanges.subscribe(() => {
      if (this.verificationFailed) {
        this.verificationFailed = false;
      }
    });
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.loaderActive = true;
    this.loaderMessage = 'Loading...';
    this.user = await this.account.getUser().toPromise().catch(error => console.log(error)) as User;
    this.sendVerificationCode();
    this.loaderActive = false;
  }

  //#region Verification
  sendVerificationCode() {
    this.auth.sendVerification().subscribe(() => { this.activateTimer(); }, error => console.error(error));
  }

  confirmVerificationCode() {
    this.confirmationState = ClrLoadingState.LOADING;
    this.auth.verifyCode(this.password.value).subscribe(async () => {
      this.loaderActive = true;
      this.loaderMessage = 'Accessing account...';
      await this.account.getUser();
      this.loaderActive = false;
      await this.router.navigate(['dashboard']);
    }, error => {
        this.confirmationState = ClrLoadingState.ERROR;
        this.verificationFailed = true;
        console.log(error);
    });
  }

  onSubmit() {
    if (!this.timerActive) {
      this.sendVerificationCode();
    } else {
      this.confirmVerificationCode();
    }
  }
  //#endregion

  //#region Timing and Utilities
  private activateTimer() {
    this.timeLeft = this.timerDuration;
    this.timerActive = true;
    this.checkpointActive = false;

    this.timer = timer(1000, 1000).subscribe(val => {
      if (this.timeLeft <= 0) {
        this.timer.unsubscribe();
        this.timerActive = false;
      } else if (this.timeLeft === this.timerCheckpoint) {
        this.checkpointActive = true;
        this.timeLeft = this.timerDuration - val;
      } else {
        this.timeLeft = this.timerDuration - val;
      }
    });
  }
  //#endregion

  async goBack() {
    this.timer.unsubscribe();
    this.timerActive = false;
    await this.router.navigate(['../']);
  }
}

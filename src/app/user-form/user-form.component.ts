import {Component, OnInit, AfterViewInit, HostListener, Output} from '@angular/core';
import { IState } from '../_interfaces/iState';
import { DataService } from '../_services/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import {AccountService} from '../_services/account.service';
import {User} from '../_models/user';
import {UIService} from '../_services/ui.service';
import {AlertService} from '../_services/alert.service';
import {AuthService} from '../_services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, AfterViewInit {
  @Output() busy = true;
  @Output() busyMessage = 'Accessing account...';

  user: User;
  screenWidth: any;
  screenHeight: any;
  form = this.fb.group({
    lastName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    otherNames: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    stateOfOrigin: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    dateOfBirth: [''],
    gender:  ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    maritalStatus:  ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    qualification: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    rank: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    department: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    location: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
  });

  malePassportPlaceholder = 'assets/images/african-svgrepo-com.svg';
  femalePassportPlaceholder = 'assets/images/african-woman-svgrepo-com.svg';
  passportPlaceholder = this.malePassportPlaceholder;
  signaturePlaceholder = 'assets/images/pen-svgrepo-com.svg';

  //#region Getters
  get lastName() { return this.form.get('lastName'); }
  get otherNames() { return this.form.get('otherNames'); }
  get stateOfOrigin() { return this.form.get('stateOfOrigin'); }
  get dateOfBirth() { return this.form.get('dateOfBirth'); }
  get gender() { return this.form.get('gender'); }
  get maritalStatus() { return this.form.get('maritalStatus'); }
  get qualification() { return this.form.get('qualification'); }
  get rank() { return this.form.get('rank'); }
  get department() { return this.form.get('department'); }
  get location() { return this.form.get('location'); }
  //#endregion

  states: IState[] = [];

  //#region init
  constructor(private data: DataService, private fb: FormBuilder,
              private account: AccountService, private auth: AuthService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.onResize();
  }

  async ngAfterViewInit() {
    this.gender.valueChanges.subscribe((value: string) => {
      if (value === 'Female') {
        this.passportPlaceholder = this.femalePassportPlaceholder;
      } else {
        this.passportPlaceholder = this.malePassportPlaceholder;
      }
    });

    this.busy = true;

    // this.loadStates();

    const states = await this.data.getNigerianStates().toPromise().catch(error => {
      // TODO: State an error
      console.log(error);
    });

    if (states) {
      this.states = states as IState[];
    }

    await this.account.getUser().toPromise();
    this.user = this.account.user;
    console.log(this.user);
    this.updateForm();

    this.busy = false;

    this.onResize();

    if (this.auth.justLoggedIn) {
      this.auth.justLoggedIn = false;
      this.alertService.success('Login was successful. Welcome '
        + this.user.otherNames.split(' ')[0] + '!');
    }
  }
  //#endregion


  updateForm() {
    this.form.patchValue({
      last_name: this.user.otherNames
    });


    this.lastName.setValue(this.user.lastName);
    this.otherNames.setValue(this.user.otherNames);
    this.stateOfOrigin.setValue(this.user.stateOfOrigin);
    this.dateOfBirth.setValue(this.user.dateOfBirth.toLocaleDateString('en-US'));
    this.gender.setValue(this.user.gender);
    this.maritalStatus.setValue(this.user.maritalStatus);
    this.qualification.setValue(this.user.qualification);
    this.rank.setValue(this.user.rank);
    this.department.setValue(this.user.department);
    this.location.setValue(this.user.location);
  }

  createUser(): User {
    const user: User = {
      fileNo: this.user.fileNo,
      phoneNumber: this.user.phoneNumber,
      lastName: this.lastName.value as string,
      otherNames: this.otherNames.value as string,
      stateOfOrigin: this.stateOfOrigin.value as string,
      dateOfBirth: new Date(this.dateOfBirth.value as string),
      gender: this.gender.value as string,
      maritalStatus: this.maritalStatus.value as string,
      qualification: this.qualification.value as string,
      rank: this.rank.value as string,
      department: this.department.value as string,
      location: this.location.value as string
    };
    return user;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  async onSubmit() {
    this.busyMessage = 'Updating Details...';
    this.busy = true;
    let errorOccurred = false;

    console.log(this.createUser());

    await this.account.updateUser(this.createUser()).toPromise().catch(error => {
      console.log(error);
      errorOccurred = true;
      this.busy = false;
      this.alertService.error('An error occurred while'
      + ' attempting to update your details. Please try again in a moment.');
    });

    if (errorOccurred) { return; }

    this.busyMessage = 'Almost Done...';
    await this.account.getUser().toPromise();
    this.user = this.account.user;
    this.updateForm();
    this.busy = false;

    this.alertService.success('Your details were updated successfully!');
  }
}

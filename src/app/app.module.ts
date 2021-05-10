import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserFormComponent } from './user-form/user-form.component';
import { LoginComponent } from './home/login/login.component';
import { LoginFormComponent } from './home/login-form/login-form.component';
import { PhoneVerificationComponent } from './home/phone-verification/phone-verification.component';
import { environment } from '../environments/environment';
import {TokenInterceptor} from './_services/interceptor';
import { ImageControlComponent } from './utils/image-control/image-control.component';
import {FileUploadModule} from 'ng2-file-upload';
import { ErrorPageComponent } from './utils/error-page/error-page.component';
import { PhoneRegistrationComponent } from './home/phone-registration/phone-registration.component';
import { AdminModule } from './admin/admin.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ProfileComponent } from './home/profile/profile.component';
import { ApplicationComponent } from './home/application/application.component';
import { SettingsComponent } from './home/settings/settings.component';


@NgModule({
   declarations: [
      AppComponent,
      UserFormComponent,
      LoginComponent,
      LoginFormComponent,
      PhoneVerificationComponent,
      ImageControlComponent,
      ErrorPageComponent,
      PhoneRegistrationComponent,
      ProfileComponent,
      ApplicationComponent,
      SettingsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: [environment.apiBase],
        blacklistedRoutes: [environment.apiBase + 'auth']
      }
    }),
    FileUploadModule,
    AdminModule,
    InfrastructureModule
  ],
   providers: [
     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
   ],
   bootstrap: [
      AppComponent
   ]
})

export class AppModule { }

export function getToken() {
  return JSON.parse(JSON.stringify(localStorage.getItem('access_token')));
}

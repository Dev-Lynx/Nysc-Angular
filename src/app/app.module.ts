import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { UserFormComponent } from './user-form/user-form.component';
import { LoginComponent } from './home/login/login.component';
import { LoginFormComponent } from './home/login-form/login-form.component';
import { PhoneVerificationComponent } from './home/phone-verification/phone-verification.component';
import { environment } from '../environments/environment';
import {TokenInterceptor} from './_services/interceptor';
import { LoaderComponent } from './loader/loader.component';
import { ImageControlComponent } from './utils/image-control/image-control.component';
import {FileUploadModule} from 'ng2-file-upload';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { ErrorPageComponent } from './utils/error-page/error-page.component';


@NgModule({
   declarations: [
      AppComponent,
      DashboardComponent,
      NavComponent,
      UserFormComponent,
      LoginComponent,
      LoginFormComponent,
      PhoneVerificationComponent,
      LoaderComponent,
      ImageControlComponent,
      ErrorPageComponent
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
    RoundProgressModule,
    FileUploadModule
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBaseComponent } from './admin-base/admin-base.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { environment } from 'src/environments/environment';

import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {FileUploadModule} from 'ng2-file-upload';

import { InfrastructureModule } from "src/app/infrastructure/infrastructure.module";
import { HqDashboardComponent } from './hq-dashboard/hq-dashboard.component';
import { HqPackageDialogComponent } from './hq-package-dialog/hq-package-dialog.component';

@NgModule({
  declarations: [
    AdminBaseComponent,
    HqDashboardComponent,
    HqPackageDialogComponent
  ],
  imports: [
    CommonModule,
    InfrastructureModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: [environment.apiBase],
        blacklistedRoutes: [environment.apiBase + 'auth']
      }
    }),
    RoundProgressModule,
    FileUploadModule,
  ]
})
export class AdminModule { }

export function getToken() {
  return JSON.parse(JSON.stringify(localStorage.getItem('access_token')));
}

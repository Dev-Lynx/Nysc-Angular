import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';

import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { ClarityModule } from '@clr/angular';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {FileUploadModule} from 'ng2-file-upload';

import { NavComponent } from "../infrastructure/common/nav/nav.component";
import { LoaderComponent } from "src/app/infrastructure/common/loader/loader.component";

@NgModule({
  declarations: [
    LoaderComponent,
    NavComponent
  ],
  imports: [
    CommonModule,

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
  ],
  exports: [
    LoaderComponent,
    NavComponent
  ]
})
export class InfrastructureModule { }

export function getToken() {
  return JSON.parse(JSON.stringify(localStorage.getItem('access_token')));
}


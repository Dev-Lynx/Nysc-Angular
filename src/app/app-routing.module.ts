import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './home/login/login.component';
import { LoginFormComponent } from './home/login-form/login-form.component';
import { PhoneVerificationComponent } from './home/phone-verification/phone-verification.component';
import { PhoneRegistrationComponent } from './home/phone-registration/phone-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuard} from './_guards/auth.guard';
import {VerificationGuard} from './_guards/verification.guard';
import { AdminBaseComponent } from "./admin/admin-base/admin-base.component";
import { HqDashboardComponent } from "./admin/hq-dashboard/hq-dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivateChild: [VerificationGuard],
    children: [
      { path: '', component: LoginFormComponent },
      { path: 'phoneVerification', component: PhoneVerificationComponent },
      { path: 'linkPhone', component: PhoneRegistrationComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  },
  {
    path: "hq",
    component: AdminBaseComponent,
    children: [
      { path: "", component: HqDashboardComponent }
    ]
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent  }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
  // { path: '**', redirectTo: '', pathMatch: 'full' },
];

// , { enableTracing: true }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

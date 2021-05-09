import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationGuard implements CanActivateChild  {

  constructor(private auth: AuthService, private router: Router) {
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const path = route.routeConfig.path;

    // console.log("verifying", path);
    // return true;

    switch (path) {
      case 'phoneVerification':
        if (!this.auth.loggedIn()) {
          await this.router.navigate(['login']);
          return false;
        } 
        // else if (this.auth.userVerified()) {
        //   await this.router.navigate(['dashboard']);
        //   return false;
        // }
        break;

      // default:
      //   if (this.auth.loggedIn() && this.auth.userVerified()) {
      //     await this.router.navigate(['dashboard']);
      //     return false;
      //   }
      //   break;
    }
    return true;
  }
}

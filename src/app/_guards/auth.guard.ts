import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.loggedIn() && this.authService.userVerified()) {
      return true;
    }

    console.log("Activating", route.url);

    // if (route.url)
    
    this.router.navigate(['login']);
    return false;
  }
}

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
      // return true;

      console.log("Activating", route.firstChild);
    

      const url = route.firstChild.url[0].path;
      console.log(`'${url}'`, "IsAdmin?", url === "hq" && this.authService.role === "Administrator", this.authService.role);
      
      if (url === "hq" && this.authService.role === "Administrator") {
        return true;
      } else if (this.authService.role === "RegularUser" && url !== "hq") {
        return true;
      }
      // return true;
    }

    console.log("Skipping");
    // const chunks = url.split("/");

    // for (const chunk in chunks) {
    //   if (chunk === "") {
    //     continue;
    //   }
    // }

    // if (route.url)
    
    this.router.navigate(['/login']);
    console.log("Going to login");
    return false;
  }
}

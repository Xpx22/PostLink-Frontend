import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable()
export class UserAuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isUserAuthenticated = this.authService.getIsUserAuthenticated();
    if(!isUserAuthenticated){
      this.router.navigate(["/signin"]);
    }
    return isUserAuthenticated;
  }
}

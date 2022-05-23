import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable()
export class EmployerAuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isEmployerAuthenticated = this.authService.getIsEmployerAuthenticated();
    if(!isEmployerAuthenticated){
      this.router.navigate(["/signin"]);
    }
    return isEmployerAuthenticated;
  }
}

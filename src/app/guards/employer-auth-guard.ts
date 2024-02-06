import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class EmployerAuthGuard {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isEmployerAuthenticated = this.authService.getIsEmployerAuthenticated();
    if(!isEmployerAuthenticated){
      this.router.navigate(["/signin"]);
    }
    return isEmployerAuthenticated;
  }
}

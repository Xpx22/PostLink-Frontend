import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ErrorDialog } from "../components/error-dialog/error.component";

import { AuthService } from "../services/auth.service";

@Injectable()
export class OneLoginGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isUserAuthenticated = this.authService.getIsUserAuthenticated();
    const isEmployerAuthenticated = this.authService.getIsEmployerAuthenticated();
    if(isUserAuthenticated || isEmployerAuthenticated){
      //say you already logged in!!
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Autentication error!",
          message: "You are already logged in!"
        }
      });
      this.router.navigate(["/"]);
      return false;
    }
    return true; //true
  }
}

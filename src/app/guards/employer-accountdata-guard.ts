import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { AccountDataService } from "../services/account-data.service";
import { ErrorDialog } from "../components/error-dialog/error.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";

@Injectable()
export class EmployerAccountDataGuard {
  constructor(
    private accountDataService: AccountDataService,
    private router: Router,
    private dialog: MatDialog){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const employerData = this.accountDataService.getEmployerData();
    if(!employerData){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Insufficient data error!",
          message: "please provide company name and phone number."
        }
      })
      this.router.navigate(["/employers/account"]);
    }
    const isDataProvided = Boolean(employerData.companyName && employerData.phoneNumber);
    if(!isDataProvided){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Insufficient data error!",
          message: "please provide company name and phone number."
        }
      })
      this.router.navigate(["/employers/account"]);
    }
    return isDataProvided;
  }
}

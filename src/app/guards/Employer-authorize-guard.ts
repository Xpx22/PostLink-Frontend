import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";


import { ErrorDialog } from "../components/error-dialog/error.component";
import { JobsService } from "../services/jobs.service";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class EmployerAuthorizeGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jobsService: JobsService,
    private dialog: MatDialog){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const jobId = route.params["id"];
    const employerID = this.authService.getEmployerID();
    this.jobsService.searchJobPostByID(jobId);
    const job = this.jobsService.getSelectedJob();
    if(!job){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Unauthorized access error!",
          message: "Unauthorized access to other company's data."
        }
      })
      this.router.navigate(["/"]);
    }
    return job.creator === employerID;
  }
}

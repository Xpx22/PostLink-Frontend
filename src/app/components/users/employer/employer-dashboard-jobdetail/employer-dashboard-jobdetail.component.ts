import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ErrorDialog } from '../../../error-dialog/error.component';
import { JobPost } from '../../../../models/job.model';
import { JobsService } from '../../../../services/jobs.service';
import { ConfirmDialog } from '../../../confirm-dialog/confirm.component';
import { AccountDataService } from '../../../../services/account-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './employer-dashboard-jobdetail.component.html',
  styleUrls: ['./employer-dashboard-jobdetail.component.scss']
})
export class EmployerDashboardJobDetailComponent implements OnInit, OnDestroy{
  job!: JobPost;
  private routeSub!: Subscription;
  private jobSubcription!: Subscription;
  private userSub = new Subscription;
  private employerID!: string | null;
  isCreator = false;
  usersList!: any[];

  constructor(
    private jobsService: JobsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private accountDataService: AccountDataService,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.employerID = localStorage.getItem("employerid");
    this.routeSub = this.route.params.subscribe(params => {
      this.jobsService.searchJobPostByID(params['id']);
    });
    this.jobSubcription = this.jobsService.getSelectedJobListener().subscribe((job)=>{
      this.job = job;
      this.isCreator = this.employerID === this.job.creator;
      if(this.employerID){
        this.accountDataService.fetchAppliedUsersData(this.employerID, this.job._id);
        this.accountDataService.getAppliedUsersListener().subscribe(usersData => {
          this.usersList = usersData;
        });
      }
    });
  }

  editJob(){
    if(!this.isCreator){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Job creator ID error!",
          message: "You are not authorized to edit other company's job."
        }
      });
      return;
    }
    this.router.navigate(["employers/editjob/"+this.job._id]);
  }

  deleteJob(){
    if(this.job.creator !== this.employerID){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Job creator ID error!",
          message: "You are not authorized to edit other company's job."
        }
      });
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        type: "Are you sure you want to delete this job?",
        message: "You will not be able to undo this action!"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.jobsService.deleteJobPost(this.job._id);
        this.router.navigate(["/"]);
      }
    });
  }

  acceptUser(userID: string, status: number){
    if(!this.employerID){
      alert("Employer id missing!");
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        type: "Accept user's application?",
        message: "User will be able to see your response."
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result && this.employerID){
        for(let i = 0; i < this.usersList.length; i++){
          if(this.usersList[i]._id === userID){
            this.usersList[i].status = 1;
          }
        }
        this.jobsService.acceptUser(this.employerID, userID, this.job._id);
      }
    });
  }

  declineUser(userID: string){
    if(!this.employerID){
      alert("Employer id missing!");
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        type: "Decline user's application?",
        message: "Refreshing the page will hide the user permanently."
      }
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result && this.employerID){
        for(let i = 0; i < this.usersList.length; i++){
          if(this.usersList[i]._id === userID){
            this.usersList[i].status = -1;
          }
        }
        this.jobsService.declineUser(this.employerID, userID, this.job._id);
      }
    });
  }

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.jobSubcription.unsubscribe();
    this.userSub.unsubscribe();
  }
}

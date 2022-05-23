import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ErrorDialog } from '../../error-dialog/error.component';
import { JobPost } from '../../../models/job.model';
import { JobsService } from '../../../services/jobs.service';
import { ConfirmDialog } from '../../confirm-dialog/confirm.component';

@Component({
  selector: "app-job-details",
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit, OnDestroy{
  job!: JobPost;
  private routeSub!: Subscription;
  private jobSubcription!: Subscription;
  private employerSub = new Subscription;
  private userSub = new Subscription;
  private userID!: string | null;
  private employerID!: string | null;
  isCreator = false;

  constructor(
    private jobsService: JobsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog){}

  ngOnInit(): void {
    this.userID = localStorage.getItem("userid");
    this.employerID = localStorage.getItem("employerid");
    this.routeSub = this.route.params.subscribe(params => {
      this.jobsService.searchJobPostByID(params['id']);
    });
    this.jobSubcription = this.jobsService.getSelectedJobListener().subscribe((job)=>{
      this.job = job;
      this.isCreator = this.employerID === this.job.creator;
    });
  }

  applyForJob(){
    if(this.userID){
      this.jobsService.applyJob(this.userID, this.job._id);
      return;
    }
    this.dialog.open(ErrorDialog, {
      data: {
        type: "Authorization error!",
        message: "Sign in as user to apply for job!"
      }
    });
    this.router.navigate(["/signin"]);
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

  bookmarkJob(){
    if(this.userID){
      this.jobsService.bookmarkJob(this.userID, this.job._id);
      return;
    }
    this.dialog.open(ErrorDialog, {
      data: {
        type: "Authorization error!",
        message: "Sign in as user to bookmark job!"
      }
    });
    this.router.navigate(["/signin"]);
  }

  ngOnDestroy(){
    this.routeSub.unsubscribe();
    this.jobSubcription.unsubscribe();
    this.employerSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}

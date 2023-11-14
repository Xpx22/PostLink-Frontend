import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import * as moment from "moment";

import { JobPost } from "../models/job.model";
import { AuthService } from "./auth.service";
import { ErrorDialog } from "../components/error-dialog/error.component";
import { SuccessDialog } from "../components/success-dialog/success.component";
import { ConfirmDialog } from "../components/confirm-dialog/confirm.component";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { environment } from "../../environments/environment";

const JOBS_BACKEND_URL = environment.apiUrl + "/posts/";
const EMPLOYER_BACKEND_URL = environment.apiUrl + "/employers/";
const USER_BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({providedIn: "root"})
export class JobsService{
  private employerDashboardList: JobPost[] = [];
  private userBookmarkList: JobPost[] = [];
  private userDashboardList: any[] = [];
  private jobPostsList: JobPost[] = [];
  private jobsListener = new Subject<{jobs: JobPost[], jobsCount: number}>();
  private employerJobsListener = new Subject<{jobs: JobPost[], jobsCount: number}>();
  private selectedJobListener = new Subject<JobPost>();
  private userBookmarkListener = new Subject<{jobs: JobPost[], jobsCount: number}>();
  private userDashboardListener = new Subject<{jobs: any[], jobsCount: number}>();
  private selectedJob!: JobPost;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar){}

  getJobPostUpdateListener() {
    return this.jobsListener.asObservable();
  }

  getEmployerJobsUpdateListener() {
    return this.employerJobsListener.asObservable();
  }

  getSelectedJobListener(){
    return this.selectedJobListener.asObservable();
  }

  getUserBookmarkListener(){
    return this.userBookmarkListener.asObservable();
  }

  getUserDashboardListener(){
    return this.userDashboardListener;
  }

  searchJobPostByID(jobId: string){
    this.http.get<{job: JobPost, message: string}>(JOBS_BACKEND_URL+jobId).subscribe((response)=>{
      this.selectedJob = response.job;
      this.selectedJobListener.next(response.job);
    }, error =>{
      this.router.navigate(["/"]);
    });
  }

  getSelectedJob(){
    return this.selectedJob;
  }

  getJobPosts(
    jobsPerPage: number,
    currentPage: number,
    position: string,
    company: string,
    location: string,
    sortby: string = "") {
    const queryParams = `?pagesize=${jobsPerPage}&page=${currentPage}&position=${position}&company=${company}&location=${location}&sortby=${sortby}`;
    this.http.get<{ jobs: JobPost[], jobsCount: number }>(JOBS_BACKEND_URL + queryParams).subscribe( (jobsData) => {
      const jobsListTemp = jobsData.jobs;
      if(jobsListTemp.length < 1){
        this.dialog.open(ErrorDialog, {
          data: {
            type: "Job count error",
            message: "Job count is less than 1"
          }
        });
      }

      for(let i = 0; i < jobsListTemp.length; i++){
        jobsListTemp[i].dateUploaded = moment(jobsListTemp[i].dateUploaded.toString()).local().fromNow();
      }
      //add http:// prefix to websites incase of another implementation
      // for(let i = 0; i < jobsListTemp.length; i++){
      //   jobsListTemp[i].website = "http://"+ jobsListTemp[i].website;
      // }

      //random sort array
      // for (let i = jobsListTemp.length - 1; i > 0; i--) {
      //   const j = Math.floor(Math.random() * (i + 1));
      //   const temp = jobsListTemp[i];
      //   jobsListTemp[i] = jobsListTemp[j];
      //   jobsListTemp[j] = temp;
      // }
      this.jobPostsList = jobsListTemp;
      this.jobsListener.next({
        jobs: [...this.jobPostsList],
        jobsCount: jobsData.jobsCount
      });
    }, error => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Job fetching error!",
          message: "Fetching jobs failed :("
        }
      });
    });
  }

  getJobPostsByEmployer(jobsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${jobsPerPage}&page=${currentPage}`;
    this.http.get<{ jobs: JobPost[], jobsCount: number }>(EMPLOYER_BACKEND_URL+this.authService.getEmployerID()+"/dashboard" + queryParams).subscribe( (jobsData) => {
      const jobsListTemp = jobsData.jobs;
      if(jobsListTemp.length < 1){ return; }
      for(let i = 0; i < jobsListTemp.length; i++){
        jobsListTemp[i].dateUploaded = moment(jobsListTemp[i].dateUploaded.toString()).fromNow();
      }
      this.employerDashboardList = jobsListTemp;
      this.employerJobsListener.next({
        jobs: [...this.employerDashboardList],
        jobsCount: jobsData.jobsCount
      });
    });
  }

  addJobPost(jobPost: JobPost) {
    this.http.post<{ message: string }>(JOBS_BACKEND_URL, {job: jobPost, employerID: this.authService.getEmployerID(), isEmployer: true}).subscribe( (response) => {
      this.jobPostsList.push(jobPost);
      this.jobsListener.next({
        jobs: [...this.jobPostsList],
        jobsCount: this.jobPostsList.length
      });
      this.router.navigate(["/employers/dashboard"]);
    }, error => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Job creation error!",
          message: "Unfortunately we could not create the job :("
        }
      });
    });
  }

  updateJobPost(jobPost: JobPost){
    const url = EMPLOYER_BACKEND_URL+this.authService.getEmployerID()+"/dashboard/"+jobPost._id;
    this.http.put<{ message: string}>(url, jobPost).subscribe((response)=>{
      this.snackBar.open("Successfully updated job details!", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    }); //NO ERROR HANDLING
  }

  deleteJobPost(jobId: string){
    const url = EMPLOYER_BACKEND_URL+this.authService.getEmployerID()+"/dashboard/"+jobId;
    this.http.delete<{message: string}>(url).subscribe((response)=>{
      this.snackBar.open("Job Removed successfully!","",{
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    }, error => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Job deletion error!",
          message: "We could not delete the job for you :("
        }
      });
    });
  }


  getUserBookmarkJobs(jobsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${jobsPerPage}&page=${currentPage}`;
    this.http.get<{ jobs: JobPost[], jobsCount: number }>(USER_BACKEND_URL+this.authService.getUserID()+"/bookmarks" + queryParams).subscribe( (jobsData) => {
      const jobsListTemp = jobsData.jobs;
      if(jobsListTemp.length < 1){ return; }
      for(let i = 0; i < jobsListTemp.length; i++){
        jobsListTemp[i].dateUploaded = moment(jobsListTemp[i].dateUploaded.toString()).fromNow();
      }
      this.userBookmarkList = jobsListTemp;
      this.userBookmarkListener.next({
        jobs: [...this.userBookmarkList],
        jobsCount: jobsData.jobsCount
      });
    });
  }

  bookmarkJob(userID: string, jobID: string){
    const url = USER_BACKEND_URL+userID+"/bookmarks/"+jobID;
    this.http.post<{ message: string}>(url, "").subscribe((response)=>{
      if(response.message.includes("exist")){
        const dialogRef = this.dialog.open(ConfirmDialog, {
          data: {
            type: "Bookmark already exists!",
            message: "Are you sure you want to remove from your bookmarks?"
          }
        });
        dialogRef.afterClosed().subscribe(choice => {
          if(choice){
            this.removeBookmark(userID, jobID);
          }
        });
        return;
      }
      this.snackBar.open(response.message,"",{
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    });
  }

  removeBookmark(userID: string, jobID: string){
    const url = USER_BACKEND_URL+userID+"/bookmarks/"+jobID;
    this.http.delete<{ message: string}>(url).subscribe((response)=>{
      if(response.message.includes("not exist")){
        this.dialog.open(ErrorDialog, {
          data: {
            type: response.message,
            message: "You have not bookmarked this job!"
          }
        });
        return;
      }
      this.snackBar.open("Unbookmarked successfully!","",{
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    });
  }


  getUserDashboardJobs(jobsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${jobsPerPage}&page=${currentPage}`;
    this.http.get<{ jobs: any[], jobsCount: number }>(USER_BACKEND_URL+this.authService.getUserID()+"/dashboard" + queryParams).subscribe( (jobsData) => {
      const jobsListTemp = jobsData.jobs;
      if(jobsListTemp.length < 1){ return; }
      for(let i = 0; i < jobsListTemp.length; i++){
        jobsListTemp[i].job.dateUploaded = moment(jobsListTemp[i].job.dateUploaded.toString()).fromNow();
      }
      this.userDashboardList = jobsListTemp;
      this.userDashboardListener.next({
        jobs: [...this.userDashboardList],
        jobsCount: jobsData.jobsCount
      });
    });
  }

  applyJob(userID: string, jobID: string){
    const url = USER_BACKEND_URL+userID+"/dashboard/"+jobID;
    this.http.post<{ message: string}>(url, "").subscribe((response)=>{
      if(response.message.includes("already applied")){
        const dialogRef = this.dialog.open(ConfirmDialog, {
          data: {
            type: "Already applied for the job!",
            message: "Are you sure you want to unapply from the job?"
          }
        });
        dialogRef.afterClosed().subscribe(choice => {
          if(choice){
            this.unapplyJob(userID, jobID);
          }
        });
        return;
      }
      else if(response.message.includes("upload")){
        this.dialog.open(ErrorDialog, {
          data: {
            type: "CV missing error!",
            message: response.message
          }
        });
        return;
      }
      this.dialog.open(SuccessDialog, {
        data: {
          type: "Applied successfully!",
          message: response.message
        }
      });
    });
  }

  unapplyJob(userID: string, jobID: string){
    const url = USER_BACKEND_URL+userID+"/dashboard/"+jobID;
    this.http.delete<{ message: string}>(url).subscribe((response)=>{
      if(response.message.includes("not exist")){
        this.dialog.open(ErrorDialog, {
          data: {
            type: response.message,
            message: "You have not applied for this job!"
          }
        });
        return;
      }
      this.dialog.open(SuccessDialog, {
        data: {
          type: "Unapplied successfully!",
          message: response.message
        }
      });
    });
  }


  acceptUser(employerID: string, userID: string, jobID: string){
    const url = EMPLOYER_BACKEND_URL+employerID+"/users/"+userID+"/posts/"+jobID+"/accept";
    this.http.put<{message: string}>(url, "").subscribe((response)=>{
      this.snackBar.open(response.message,"",{
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    }, message =>{
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Action error!",
          message: message
        }
      });
    });
  }


  declineUser(employerID: string, userID: string, jobID: string){
    const url = EMPLOYER_BACKEND_URL+employerID+"/users/"+userID+"/posts/"+jobID+"/decline";
    this.http.put<{message: string}>(url, "").subscribe((response)=>{
      this.snackBar.open(response.message,"",{
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: ["green-snackbar"]
      });
    }, error =>{
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Action error!",
          message: "Failed to implement action :("
        }
      });
    });
  }
}

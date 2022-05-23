import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { JobPost } from "../../models/job.model";
import { JobsService } from "../../services/jobs.service";


@Component({
  selector: "app-posts-list",
  templateUrl: "./jobs-list.component.html",
  styleUrls: ["./jobs-list.component.scss"]
})

export class JobsListComponent implements OnInit, OnDestroy {
  jobsList: JobPost[] = [];
  private jobsSubscription: Subscription = new Subscription;
  totalJobPosts = 0;
  jobsPerPage = 10;
  currentPage = 1;
  pageSizeOptions=[1,5,10,20,50];

  constructor(private router: Router, public jobsService: JobsService){}

  ngOnInit(): void {
    // this.jobsService.getJobPosts(this.jobsPerPage, this.currentPage);
    this.jobsSubscription = this.jobsService.getJobPostUpdateListener().subscribe( (posts: {jobs: JobPost[], jobsCount: number}) => {
      this.totalJobPosts = posts.jobsCount;
      this.jobsList = posts.jobs;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.jobsPerPage = pageData.pageSize;
    // this.jobsService.getJobPosts(this.jobsPerPage, this.currentPage);
  }

  onNavigateToJobDetails(job: JobPost){
    this.router.navigate(["/jobdetails/"+ job._id]);
  }

  ngOnDestroy(): void {
    this.jobsSubscription.unsubscribe();
  }
}

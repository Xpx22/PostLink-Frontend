import { Component, OnDestroy, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


import { JobPost } from '../../../../models/job.model';
import { JobsService } from '../../../../services/jobs.service';

@Component({
  selector: 'app-user-bookmark',
  templateUrl: './user-bookmark.component.html',
  styleUrls: ['./user-bookmark.component.scss']
})
export class UserBookmarkComponent implements OnInit, OnDestroy {
  jobsList: JobPost[] = [];
  totalJobPosts = 0;
  jobsPerPage = 10;
  currentPage = 1;
  pageSizeOptions=[1,5,10,20,50];
  private userBookmarkSub: Subscription = new Subscription;

  constructor(
    private jobsService: JobsService,
    private router: Router){}

    ngOnInit(): void {
      this.jobsService.getUserBookmarkJobs(this.jobsPerPage, this.currentPage);
      this.userBookmarkSub = this.jobsService.getUserBookmarkListener().subscribe( (jobs: {jobs: JobPost[], jobsCount: number}) => {
        this.totalJobPosts = jobs.jobsCount;
        this.jobsList = jobs.jobs;
      });
    }

    onChangedPage(pageData: PageEvent){
      this.currentPage = pageData.pageIndex + 1;
      this.jobsPerPage = pageData.pageSize;
      this.jobsService.getUserBookmarkJobs(this.jobsPerPage, this.currentPage);
    }

    onNavigateToJobDetails(job: JobPost){
      this.router.navigate(["/jobdetails/"+ job._id]);
    }

    ngOnDestroy(): void {
      this.userBookmarkSub.unsubscribe();
    }
}

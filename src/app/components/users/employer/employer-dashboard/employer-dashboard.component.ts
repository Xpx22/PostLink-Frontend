import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { JobPost } from '../../../../models/job.model';
import { JobsService } from '../../../../services/jobs.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, MatIconModule, MatPaginatorModule, SlicePipe],
})
export class EmployerDashboardComponent implements OnInit, OnDestroy {
  jobsList: any[] = [];
  totalJobPosts = 0;
  jobsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 5, 10, 20, 50];
  private employerJobsSubscription: Subscription = new Subscription();

  constructor(private jobsService: JobsService, private router: Router) {}

  ngOnInit(): void {
    this.jobsService.getJobPostsByEmployer(this.jobsPerPage, this.currentPage);
    this.employerJobsSubscription = this.jobsService
      .getEmployerJobsUpdateListener()
      .subscribe((jobs: { jobs: any[]; jobsCount: number }) => {
        this.totalJobPosts = jobs.jobsCount;
        this.jobsList = jobs.jobs;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.jobsPerPage = pageData.pageSize;
    this.jobsService.getJobPostsByEmployer(this.jobsPerPage, this.currentPage);
  }

  onNavigateToJobDetails(job: JobPost) {
    this.router.navigate(['/employers/dashboard/' + job._id + '/jobdetails']);
  }

  ngOnDestroy(): void {
    this.employerJobsSubscription.unsubscribe();
  }
}

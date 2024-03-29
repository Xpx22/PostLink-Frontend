import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { JobPost } from '../../../../models/job.model';
import { JobsService } from '../../../../services/jobs.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, MatIconModule, MatPaginatorModule, SlicePipe, MatCardModule],
})
export class UserDashboardComponent {
  jobsList: any[] = [];
  totalJobPosts = 0;
  jobsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 5, 10, 20, 50];
  private userDashboardSub: Subscription = new Subscription();

  constructor(private jobsService: JobsService, private router: Router) {}

  ngOnInit(): void {
    this.jobsService.getUserDashboardJobs(this.jobsPerPage, this.currentPage);
    this.userDashboardSub = this.jobsService
      .getUserDashboardListener()
      .subscribe((jobs: { jobs: any[]; jobsCount: number }) => {
        this.totalJobPosts = jobs.jobsCount;
        this.jobsList = jobs.jobs;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.jobsPerPage = pageData.pageSize;
    this.jobsService.getUserDashboardJobs(this.jobsPerPage, this.currentPage);
  }

  onNavigateToJobDetails(job: JobPost) {
    this.router.navigate(['/jobdetails/' + job._id]);
  }

  ngOnDestroy(): void {
    this.userDashboardSub.unsubscribe();
  }
}

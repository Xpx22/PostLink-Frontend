import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LegacyPageEvent as PageEvent, MatLegacyPaginatorModule } from "@angular/material/legacy-paginator";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { JobPost } from "../../models/job.model";
import { JobsService } from "../../services/jobs.service";
import { MatLegacyCardModule } from "@angular/material/legacy-card";
import { NgFor, NgIf, SlicePipe } from "@angular/common";
import { MatLegacyMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { MatLegacyInputModule } from "@angular/material/legacy-input";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyFormFieldModule } from "@angular/material/legacy-form-field";

@Component({
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, MatLegacyFormFieldModule, MatIconModule, MatLegacyInputModule, MatLegacyButtonModule, MatLegacyMenuModule, NgFor, NgIf, MatLegacyCardModule, MatLegacyPaginatorModule, SlicePipe]
})

export class MainPageComponent implements OnInit, OnDestroy{
  jobsList: JobPost[] = [];
  private jobsSubscription: Subscription = new Subscription;
  totalJobPosts = 0;
  jobsPerPage = 10;
  currentPage = 1;
  pageSizeOptions=[5,10,20,50,100];
  position = "";
  company = "";
  location = "";
  readonly sortByItems = [
    { name: "Date ascending", value: "dateAsc"},
    { name: "Date descending", value: "dateDes"},
    { name: "Min salary ascending", value: "minAsc"},
    { name: "Min salary descending", value: "minDes"},
    { name: "Max salary ascending", value: "maxAsc"},
    { name: "Max salary descending", value: "maxDes"}
  ];
  @ViewChild("searchJobForm") public searchJobForm!: NgForm;

  constructor(private router: Router, public jobsService: JobsService){}

  ngOnInit(): void {
    const perPage = localStorage.getItem("perpage");
    const pos = localStorage.getItem("position");
    const com = localStorage.getItem("company");
    const loc = localStorage.getItem("location");
    const sort = localStorage.getItem("sortby");
    let sortbyParam = "";
    if(perPage && Number.isInteger(+perPage)){
      this.jobsPerPage = +perPage;
    }
    if(pos){ this.position = pos; }
    if(com){ this.company = com; }
    if(loc){ this.location = loc; }
    if(sort){ sortbyParam = sort; }
    this.jobsService.getJobPosts(this.jobsPerPage, this.currentPage, this.position, this.company, this.location, sortbyParam);
    this.jobsSubscription = this.jobsService.getJobPostUpdateListener().subscribe( (posts: {jobs: JobPost[], jobsCount: number}) => {
      this.totalJobPosts = posts.jobsCount;
      this.jobsList = posts.jobs;
    });
  }

  searchJob(){
    localStorage.setItem("position", this.searchJobForm.value.positionInput);
    localStorage.setItem("company", this.searchJobForm.value.companyInput);
    localStorage.setItem("location", this.searchJobForm.value.locationInput);
    this.jobsService.getJobPosts(
      this.jobsPerPage,
      this.currentPage,
      this.searchJobForm.value.positionInput,
      this.searchJobForm.value.companyInput,
      this.searchJobForm.value.locationInput
    );
  }

  onChangedPage(pageData: PageEvent){
    const temp = localStorage.getItem("sortby");
    let sortbyParam;
    if(temp){
      sortbyParam = temp;
    }else{
      sortbyParam = "";
    }
    this.currentPage = pageData.pageIndex + 1;
    this.jobsPerPage = pageData.pageSize;
    this.jobsService.getJobPosts(
      this.jobsPerPage,
      this.currentPage,
      this.searchJobForm.value.positionInput,
      this.searchJobForm.value.companyInput,
      this.searchJobForm.value.locationInput,
      sortbyParam
    );
    localStorage.setItem("perpage", this.jobsPerPage.toString());
  }

  onNavigateToJobDetails(job: JobPost){
    this.router.navigate(["/jobdetails/"+ job._id]);
  }

  sortBy(param: string){
    localStorage.setItem("sortby", param);
    this.jobsService.getJobPosts(
      this.jobsPerPage,
      this.currentPage,
      this.searchJobForm.value.positionInput,
      this.searchJobForm.value.companyInput,
      this.searchJobForm.value.locationInput,
      param
    );
  }

  ngOnDestroy(): void {
    this.jobsSubscription.unsubscribe();
  }
}

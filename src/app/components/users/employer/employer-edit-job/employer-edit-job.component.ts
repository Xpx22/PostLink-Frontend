import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { JobPost } from '../../../../models/job.model';
import { JobsService } from '../../../../services/jobs.service';
import { ErrorDialog } from '../../../error-dialog/error.component';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  templateUrl: './employer-edit-job.component.html',
  styleUrls: ['./employer-edit-job.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class EmployerEditJobComponent implements OnInit, OnDestroy {
  isLoading = false;
  isHomeOffice = true;
  requiredSkills: string[] = [];
  goodToHaveSkills: string[] = [];
  private job!: JobPost;
  @ViewChild('jobpostForm') public jobpostForm!: NgForm;
  private routeSub!: Subscription;
  private jobSub!: Subscription;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private jobsService: JobsService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.jobsService.searchJobPostByID(params['id']);
      this.jobSub = this.jobsService
        .getSelectedJobListener()
        .subscribe((job) => {
          this.job = job;
          this.jobpostForm.setValue({
            positionName: this.job.positionName,
            salaryMin: this.job.salaryMin,
            salaryMax: this.job.salaryMax,
            jobDescription: this.job.description,
          });
          this.isHomeOffice = this.job.homeOffice;
          this.requiredSkills = this.job.requiredSkills;
          this.goodToHaveSkills = this.job.goodToHaveSkills;
        });
    });
  }

  addReq(event: any): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.requiredSkills.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  addGood(event: any): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.goodToHaveSkills.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeReq(skill: string): void {
    const index = this.requiredSkills.indexOf(skill);
    if (index >= 0) {
      this.requiredSkills.splice(index, 1);
    }
  }

  removeGood(skill: string): void {
    const index = this.goodToHaveSkills.indexOf(skill);
    if (index >= 0) {
      this.goodToHaveSkills.splice(index, 1);
    }
  }

  setPreference() {
    this.isHomeOffice = !this.isHomeOffice;
  }

  onUpdatePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.salaryMax < form.value.salaryMin) {
      this.dialog.open(ErrorDialog, {
        data: {
          type: 'Salary error!',
          message: 'Salary max must be greater than salary min!',
        },
      });
      return;
    }
    this.isLoading = true;
    const newJobPost: JobPost = {
      _id: this.job._id,
      creator: this.job.creator,
      companyName: this.job.companyName,
      logoPath: this.job.logoPath,
      phoneNumber: this.job.phoneNumber,
      website: this.job.website,
      email: this.job.email,
      city: this.job.city,
      country: this.job.country,
      description: form.value.jobDescription,
      requiredSkills: this.requiredSkills,
      goodToHaveSkills: this.goodToHaveSkills,
      dateUploaded: new Date().toString(),
      positionName: form.value.positionName,
      homeOffice: this.isHomeOffice,
      salaryMin: form.value.salaryMin,
      salaryMax: form.value.salaryMax,
    };
    this.jobsService.updateJobPost(newJobPost);
    // form.resetForm();
    // this.requiredSkills = [];
    // this.goodToHaveSkills = [];
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.jobSub.unsubscribe();
  }
}

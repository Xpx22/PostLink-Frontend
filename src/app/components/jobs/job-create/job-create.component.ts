import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { JobPost } from '../../../models/job.model';
import { JobsService } from '../../../services/jobs.service';
import { ErrorDialog } from '../../error-dialog/error.component';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class JobCreateComponent {
  isLoading = false;
  isHomeOffice = true;
  requiredSkills: string[] = [];
  goodToHaveSkills: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private jobsService: JobsService, private dialog: MatDialog) {}

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

  onCreatePost(form: NgForm) {
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
      _id: '',
      creator: '',
      companyName: '',
      logoPath: '',
      phoneNumber: '',
      website: '',
      email: '',
      city: '',
      country: '',
      description: form.value.jobDescription,
      requiredSkills: this.requiredSkills,
      goodToHaveSkills: this.goodToHaveSkills,
      dateUploaded: new Date().toString(),
      positionName: form.value.positionName,
      homeOffice: this.isHomeOffice,
      salaryMin: form.value.salaryMin,
      salaryMax: form.value.salaryMax,
    };
    this.jobsService.addJobPost(newJobPost);
    // form.resetForm();
    this.requiredSkills = [];
    this.goodToHaveSkills = [];
    this.isLoading = false;
  }
}

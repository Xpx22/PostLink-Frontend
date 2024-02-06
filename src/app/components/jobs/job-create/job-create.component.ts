import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatLegacyChipInputEvent as MatChipInputEvent, MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { Component } from "@angular/core";
import { NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";

import { JobPost } from "../../../models/job.model";
import { JobsService } from "../../../services/jobs.service";
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorDialog } from '../../error-dialog/error.component';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: "app-post-create",
    templateUrl: "./job-create.component.html",
    styleUrls: ["./job-create.component.scss"],
    standalone: true,
    imports: [NgIf, MatLegacyCardModule, ReactiveFormsModule, FormsModule, MatLegacyFormFieldModule, MatLegacyInputModule, MatLegacyRadioModule, MatLegacyChipsModule, NgFor, MatIconModule, MatLegacyButtonModule, RouterLink]
})

export class JobCreateComponent {
  isLoading = false;
  isHomeOffice = true;
  requiredSkills: string[] = [];
  goodToHaveSkills: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private jobsService: JobsService,
    private dialog: MatDialog){}

  addReq(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.requiredSkills.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  addGood(event: MatChipInputEvent): void {
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

  setPreference(){
    this.isHomeOffice = !this.isHomeOffice;
  }

  onCreatePost(form: NgForm){
    if(form.invalid) { return; }
    if (form.value.salaryMax < form.value.salaryMin) {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Salary error!",
          message: "Salary max must be greater than salary min!"
        }
      })
      return;
    }
    this.isLoading = true;
    const newJobPost: JobPost = {
      _id: "",
      creator: "",
      companyName: "",
      logoPath: "",
      phoneNumber: "",
      website: "",
      email: "",
      city: "",
      country: "",
      description: form.value.jobDescription,
      requiredSkills: this.requiredSkills,
      goodToHaveSkills: this.goodToHaveSkills,
      dateUploaded: new Date().toString(),
      positionName: form.value.positionName,
      homeOffice: this.isHomeOffice,
      salaryMin: form.value.salaryMin,
      salaryMax: form.value.salaryMax
    }
    this.jobsService.addJobPost(newJobPost);
    // form.resetForm();
    this.requiredSkills = [];
    this.goodToHaveSkills = [];
    this.isLoading = false;
  }
}

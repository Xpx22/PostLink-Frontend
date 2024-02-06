import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';

import { AccountDataService } from '../../../../services/account-data.service';
import { ErrorDialog } from '../../../error-dialog/error.component';
import { Employer } from '../../../../models/employer.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf } from '@angular/common';

@Component({
    templateUrl: './employer-account.component.html',
    styleUrls: ['./employer-account.component.scss'],
    standalone: true,
    imports: [NgIf, MatLegacyCardModule, ReactiveFormsModule, FormsModule, MatLegacyFormFieldModule, MatIconModule, MatLegacyInputModule, MatLegacyButtonModule, RouterLink, MatLegacyProgressSpinnerModule]
})
export class EmployerAccountComponent implements OnInit, OnDestroy{
  isLoading = false;
  employerData!: Employer;
  private uploadedImage!: File;
  imgPreviewPath = "";
  private employerDataSubscription = new Subscription;
  @ViewChild("employerForm") public employerForm!: NgForm;

  constructor(
    private dialog: MatDialog,
    private accountDataService: AccountDataService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.accountDataService.fetchEmployerData();
    this.employerDataSubscription = this.accountDataService.getEmployerDataListener().subscribe((employerData)=>{
      this.employerData = employerData;
      this.employerForm.setValue({
        companyName: this.employerData.companyName,
        phoneNumber: this.employerData.phoneNumber,
        website: this.employerData.website,
        city: this.employerData.city,
        country: this.employerData.country
      });
      this.imgPreviewPath = this.employerData.logoPath;
    });
  }

  onSubmitCompanyDetails(form: NgForm){
    if(form.invalid){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Error in form!",
          message: "Data provided are invalid."
        }
      });
      return;
    }
    this.isLoading = true;
    const employerFormData = new FormData();
    employerFormData.append("_id", this.authService.getEmployerID());
    employerFormData.append("companyName", form.value.companyName);
    employerFormData.append("phoneNumber", form.value.phoneNumber);

    if(!this.employerData.logoPath && this.uploadedImage){
      employerFormData.append("logo", this.uploadedImage, form.value.companyName+"-logo");
    }
    else if(this.employerData.logoPath && this.uploadedImage){
      employerFormData.append("logo", this.uploadedImage, form.value.companyName+"-logo");
    }
    else{
      employerFormData.append("logo", this.employerData.logoPath);
    }
    console.log("datafasdgasdgafgagsgas", employerFormData);


    if(this.employerForm.value && !this.employerForm.value.website){
      employerFormData.append("website", this.employerData.website);
    }
    else{
      employerFormData.append("website", form.value.website);
    }

    if(this.employerForm.value && !this.employerForm.value.city){
      employerFormData.append("city", this.employerData.city);
    }
    else{
      employerFormData.append("city", form.value.city);
    }

    if(this.employerForm.value && !this.employerForm.value.country){
      employerFormData.append("country", this.employerData.country);
    }
    else{
      employerFormData.append("country", form.value.country);
    }
    this.accountDataService.sendEmployerAccountData(employerFormData);
    this.isLoading = false;
  }

  onChooseImage(event: Event){
    const file = (event.target as HTMLInputElement).files;
    if(file && file[0]){
      if(!file[0].type.toLowerCase().includes("image")){
        this.dialog.open(ErrorDialog, {
          data: {
            type: "File type error!",
            message: "Only images are allowed."
          }
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreviewPath = reader.result as string;
      };
      reader.readAsDataURL(file[0]);
      this.uploadedImage = file[0];
    }
  }

  ngOnDestroy(): void {
    this.employerDataSubscription.unsubscribe();
  }
}

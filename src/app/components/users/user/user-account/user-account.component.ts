import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { ErrorDialog } from '../../../error-dialog/error.component';
import { AccountDataService } from '../../../../services/account-data.service';
import { User } from '../../../../models/user.model';

@Component({
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  isLoading = false;
  userData!: User;
  private uploadedCV!: File;
  nameOfPickedFile = "";
  filePath = "";
  private userDataSubscription = new Subscription;
  @ViewChild("userForm") public userForm!: NgForm;

  constructor(
    private dialog: MatDialog,
    private accountDataService: AccountDataService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.accountDataService.fetchUserData();
    this.userDataSubscription = this.accountDataService.getUserDataListener().subscribe((userData)=>{
      this.userData = userData;
      this.userForm.setValue({
        fullname: this.userData.fullname,
        phoneNumber: this.userData.phoneNumber,
      });
      this.nameOfPickedFile = this.userData.cvPath.split("/")[4];
      this.filePath = this.userData.cvPath;
    });
  }

  onSubmitUserDetails(form: NgForm){
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
    const userFormData = new FormData();
    userFormData.append("_id", this.authService.getUserID());
    userFormData.append("fullname", form.value.fullname);
    userFormData.append("phoneNumber", form.value.phoneNumber);
    if(!this.userData.cvPath && this.uploadedCV){
      userFormData.append("cvPath", this.uploadedCV, this.nameOfPickedFile);
    }
    else if(this.userData.cvPath && this.uploadedCV){
      userFormData.append("cvPath", this.uploadedCV, this.nameOfPickedFile);
    }
    else{
      userFormData.append("cvPath", this.userData.cvPath);
    }
    this.accountDataService.sendUserAccountData(userFormData);
    this.isLoading = false;
  }

  onChooseCV(event: Event){
    const file = (event.target as HTMLInputElement).files;
    if(file && file[0]){
      if(!file[0].type.toLowerCase().includes("pdf")){
        this.dialog.open(ErrorDialog, {
          data: {
            type: "File type error!",
            message: "Only format: pdf are allowed."
          }
        });
        return;
      }
      const reader = new FileReader();
      // reader.onload = () => {
      //   this.nameOfPickedFile = reader.result as string;
      // };
      reader.readAsDataURL(file[0]);
      this.nameOfPickedFile = file[0].name;
      this.uploadedCV = file[0];
    }
  }

  ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
  }
}

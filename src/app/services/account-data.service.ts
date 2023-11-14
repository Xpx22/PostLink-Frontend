import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Subject } from "rxjs";

import { AuthService } from "./auth.service";
import { ErrorDialog } from "../components/error-dialog/error.component";
import { SuccessDialog } from "../components/success-dialog/success.component";
import { Employer } from "../models/employer.model";
import { User } from "../models/user.model";
import { environment } from "../../environments/environment";

const EMPLOYER_BACKEND_URL = environment.apiUrl + "/employers/";
const USER_BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({providedIn: "root"})
export class AccountDataService{
  private employerDataListener = new Subject<Employer>();
  private userDataListener = new Subject<User>();
  private appliedUsersListener = new Subject<User[]>();
  private employerData!: Employer;
  private userData!: User;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService){}

  getUserDataListener(){
    return this.userDataListener.asObservable();
  }
  getEmployerDataListener(){
    return this.employerDataListener.asObservable();
  }

  getEmployerData(){
    return this.employerData;
  }
  getUserData(){
    return this.userData;
  }

  getAppliedUsersListener(){
    return this.appliedUsersListener.asObservable();
  }

  fetchEmployerData(){
    this.http.get<{employer: Employer}>(EMPLOYER_BACKEND_URL+this.authService.getEmployerID()).subscribe((employerData) => {
      this.employerData = employerData.employer;
      this.employerDataListener.next(employerData.employer);
    }, message => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Employer data fetching error!",
          message: message
        }
      })
    });
  }

  sendEmployerAccountData(employerformData: FormData){
    const url = EMPLOYER_BACKEND_URL+employerformData.get("_id");
    this.http.put<{message: String}>(url, employerformData).subscribe((resData) => {
      if(resData.message.toLowerCase().includes("success")){
        this.dialog.open(SuccessDialog, {
          data: {
            type: "Data updated successfully!",
            message: "Thank you for your patience!"
          }
        });
      }
    }, error =>{
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Data updated failed!",
          message: "Not okay"
        }
      });
    });
  }

  fetchUserData(){
    this.http.get<{user: User}>(USER_BACKEND_URL+this.authService.getUserID()).subscribe((userData) => {
      this.userData = userData.user;
      this.userDataListener.next(userData.user);
    }, message => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "User data fetching error!",
          message: message
        }
      })
    });
  }

  sendUserAccountData(userformData: FormData){
    const url = USER_BACKEND_URL+userformData.get("_id");
    this.http.put<{message: String}>(url, userformData).subscribe((resData) => {
      this.dialog.open(SuccessDialog, {
        data: {
          type: "Data updated successfully!",
          message: "Thank you for your patience!"
        }
      });
    }, error =>{
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Data updated failed!",
          message: "Not okay"
        }
      });
    });
  }

  fetchAppliedUsersData(employerID: string, jobID: string){
    const url = EMPLOYER_BACKEND_URL+employerID+"/users/"+jobID;
    this.http.get<{users: any[]}>(url).subscribe((usersData)=>{
      this.appliedUsersListener.next(usersData.users);
    }, error =>{
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Applied users data fetching error!",
          message: "We could not fetch applied users data :("
        }
      });
    });
  }
}

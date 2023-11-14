import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


import { ErrorDialog } from "../components/error-dialog/error.component";
import { SuccessDialog } from "../components/success-dialog/success.component";
import { Employer } from "../models/employer.model";
import { User } from "../models/user.model";
import { AuthData } from "../models/auth-data.model";
import { environment } from "../../environments/environment";

const SIGNIN_BACKEND_URL = environment.apiUrl + "/signin/";
const SIGNUP_BACKEND_URL = environment.apiUrl + "/signup/";

@Injectable({providedIn: "root"})
export class AuthService{
  private userjwtToken: string = "";
  private employerjwtToken: string = "";
  private isUserAuthenticated = false;
  private isEmployerAuthenticated = false;
  private userAuthStateListener = new Subject<boolean>();
  private employerAuthStateListener = new Subject<boolean>();
  private userID = "";
  private employerID = "";
  private isEmployer = false;
  private tokenExpirationTime!: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog){}

  getJWTToken(){
    if(this.isEmployerAuthenticated){ return this.employerjwtToken; }
    return this.userjwtToken;
  }
  getIsUserAuthenticated(){
    return this.isUserAuthenticated;
  }
  getIsEmployerAuthenticated(){
    return this.isEmployerAuthenticated;
  }
  getUserAuthStateListener(){
    return this.userAuthStateListener.asObservable();
  }
  getEmployerAuthStateListener(){
    return this.employerAuthStateListener.asObservable();
  }
  getUserID(){
    return this.userID;
  }
  getEmployerID(){
    return this.employerID;
  }

  private saveToken(jwtToken: string, expirationTime: Date, endUserID: string){
    if(this.isEmployer){
      localStorage.setItem("employertoken", jwtToken);
      localStorage.setItem("employerid", endUserID);
    }else{
      localStorage.setItem("usertoken", jwtToken);
      localStorage.setItem("userid", endUserID);
    }
    localStorage.setItem("expirationTime", expirationTime.toISOString());
  }

  private clearToken(){
    localStorage.getItem("employertoken");
    localStorage.getItem("employerid");
    localStorage.getItem("usertoken");
    localStorage.getItem("userid");
    localStorage.getItem("expirationTime");
  }

  private setTokenTime(duration: number){
    this.tokenExpirationTime = setTimeout(()=>{
      this.signOut();
      window.location.href = "http://localhost:4200/"
    }, duration * 1000);
  }

  private getTokenData(){
    const expiration = localStorage.getItem("expirationTime");
    if(!expiration){ return; }
    let token = localStorage.getItem("employertoken");
    let id = localStorage.getItem("employerid");
    if(token && id){
      this.isEmployer = true;
      return {
        token: token,
        expirationTime: new Date(expiration),
        employerID: id
      };
    }
    token = localStorage.getItem("usertoken");
    id = localStorage.getItem("userid");
    if(token && id){
      this.isEmployer = false;
      return {
        token: token,
        expirationTime: new Date(expiration),
        userID: id
      };
    }
    return;
  }

  refreshToken(){
    const tokenInfo = this.getTokenData();
    if(!tokenInfo){
      return;
    }
    const expireTime = tokenInfo.expirationTime.getTime() - new Date().getTime();
    if(expireTime < 0){
      return;
    }
    if(this.isEmployer){
      if(!(tokenInfo.employerID)){
        alert("no employer ID!");
        return;
      }
      this.employerID = tokenInfo.employerID;
      this.employerjwtToken = tokenInfo.token;
      this.isEmployerAuthenticated = true;
      this.employerAuthStateListener.next(true);
      this.setTokenTime(Date.now() / 1000);
      return;
    }
    //if it's user
    if(!(tokenInfo.userID)){
      alert("no user ID!");
      return;
    }
    this.userID = tokenInfo.userID;
    this.userjwtToken = tokenInfo.token;
    this.isUserAuthenticated = true;
    this.userAuthStateListener.next(true);
    this.setTokenTime(Date.now() / 1000);
  }

  signIn(email: string, password: string, isEmployer: boolean){
    this.isEmployer = isEmployer;
    const authdata: AuthData = {
      email: email,
      password: password,
      isEmployer: isEmployer
    };
    this.http.post<{ message: string, token: string, expirationTime: number, employer: Employer, user:User }>(SIGNIN_BACKEND_URL, authdata).subscribe( (response) => {
      const jwtToken = response.token;
      const resMessage = response.message;
      const expirationTimeInSeconds = response.expirationTime;
      if(jwtToken){
        this.dialog.open(SuccessDialog, {
          data: {
            type: resMessage,
            message: "Welcome to PostLink!"
          }
        });
        const duration = expirationTimeInSeconds * 1000;
        this.setTokenTime(duration / 1000);
        const expirationTimeTemp = new Date(new Date().getTime() + duration);
        if(this.isEmployer){
          this.employerID = response.employer._id;
          this.employerjwtToken = jwtToken;
          this.saveToken(jwtToken, expirationTimeTemp, response.employer._id);
          this.employerAuthStateListener.next(true);
          this.isEmployerAuthenticated = true;
          this.router.navigate(["/employers/account"]);
        }
        else{
          this.userID = response.user._id;
          this.userjwtToken = jwtToken;
          this.saveToken(jwtToken, expirationTimeTemp, response.user._id);
          this.userAuthStateListener.next(true);
          this.isUserAuthenticated = true;
          this.router.navigate(["/users/account"]);
        }
      }else{
        if(this.isEmployer){
          this.employerAuthStateListener.next(false);
        }
        else{
          this.userAuthStateListener.next(false);
        }
      }
    }, error => {
      if(this.isEmployer){
        this.employerAuthStateListener.next(false);
      }else{
        this.userAuthStateListener.next(false);
      }
    });
  }

  signUp(email: string, password: string, isEmployer: boolean){
    this.isEmployer = isEmployer;
    const authdata: AuthData = {
      email: email,
      password: password,
      isEmployer: isEmployer
    };
    this.http.post<{message: string}>(SIGNUP_BACKEND_URL, authdata).subscribe( (response) => {
      this.dialog.open(SuccessDialog, {
        data: {
          type: "Successfully Signed up!",
          message: response.message
        }
      });
      this.router.navigate(["/signin"]);
    }, error => {
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Signed up failed!",
          message: "We could not sign you up :("
        }
      });
    });
  }

  signOut(){
    this.userjwtToken = "";
    this.employerjwtToken = "";
    this.isUserAuthenticated = false;
    this.isEmployerAuthenticated = false;
    this.userAuthStateListener.next(false);
    this.employerAuthStateListener.next(false);
    clearTimeout(this.tokenExpirationTime);
    this.clearToken();
    this.router.navigate(["/"]);
  }
}

import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { ErrorDialog } from "../../error-dialog/error.component";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class SignUpComponent implements OnInit, OnDestroy{
  isLoading = false;
  isEmployer = false;
  isChecked() { this.isEmployer = !this.isEmployer; }
  private isUserAuthenticated = false;
  private isEmployerAuthenticated = false;
  private userAuthSubscription = new Subscription;
  private employerAuthSubscription = new Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog) {}


  ngOnInit(): void {
    this.userAuthSubscription = this.authService.getUserAuthStateListener().subscribe((isUserAuth)=>{
      this.isUserAuthenticated = isUserAuth;
    });
    this.employerAuthSubscription = this.authService.getEmployerAuthStateListener().subscribe((isEmployerAuth)=>{
      this.isEmployerAuthenticated = isEmployerAuth;
    });
  }


  onSignUp(form: NgForm){
    if(form.invalid){ return; }

    const email = form.value.email;
    const pw = form.value.password;
    if(form.value.passwordConfirm !== pw){
      this.dialog.open(ErrorDialog, {
        data: {
          type: "Sign up information error!",
          message: "Password and password confirmation does not match!"
        }
      })
      return;
    }
    this.isLoading = true;
    this.authService.signUp(email, pw, this.isEmployer);
    if(this.isUserAuthenticated || this.isEmployerAuthenticated){
      this.isLoading = false;
      form.resetForm();
    }
  }

  ngOnDestroy(): void {
    this.userAuthSubscription.unsubscribe();
    this.employerAuthSubscription.unsubscribe();
  }
}

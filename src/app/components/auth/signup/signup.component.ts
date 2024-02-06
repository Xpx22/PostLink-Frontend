import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Subscription } from "rxjs";
import { ErrorDialog } from "../../error-dialog/error.component";
import { AuthService } from "../../../services/auth.service";
import { MatLegacyProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { RouterLink } from "@angular/router";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { MatLegacySlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatLegacyInputModule } from "@angular/material/legacy-input";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyCardModule } from "@angular/material/legacy-card";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatLegacyCardModule, ReactiveFormsModule, FormsModule, MatLegacyFormFieldModule, MatIconModule, MatLegacyInputModule, MatLegacySlideToggleModule, MatLegacyButtonModule, RouterLink, MatLegacyProgressSpinnerModule]
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

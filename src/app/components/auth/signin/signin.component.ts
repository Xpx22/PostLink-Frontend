import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../services/auth.service";
import { MatLegacyProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { MatLegacySlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatLegacyInputModule } from "@angular/material/legacy-input";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyCardModule } from "@angular/material/legacy-card";
import { NgIf } from "@angular/common";

@Component({
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.scss"],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, MatLegacyCardModule, ReactiveFormsModule, FormsModule, MatLegacyFormFieldModule, MatIconModule, MatLegacyInputModule, MatLegacySlideToggleModule, MatLegacyButtonModule, RouterLink, MatLegacyProgressSpinnerModule]
})

export class SignInComponent implements OnInit, OnDestroy{
  isLoading = false;
  private isUserAuthenticated = false;
  private isEmployerAuthenticated = false;
  private userAuthSubscription = new Subscription;
  private employerAuthSubscription = new Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog){}

  ngOnInit(): void {
    this.userAuthSubscription = this.authService.getUserAuthStateListener().subscribe( isAuthenticated =>{
      this.isUserAuthenticated = isAuthenticated;
    });
    this.employerAuthSubscription = this.authService.getEmployerAuthStateListener().subscribe( isAuthenticated =>{
      this.isEmployerAuthenticated = isAuthenticated;
    });
  }

  onSignIn(form: NgForm){
    if(form.invalid){ return; }
    this.isLoading = true;
    const email = form.value.email;
    const pw = form.value.password;
    const isEmployer = form.value.isEmployerToggle;
    this.authService.signIn(email, pw, isEmployer);
    this.isLoading = false;
    form.resetForm();
  }

  ngOnDestroy(): void {
    this.userAuthSubscription.unsubscribe();
    this.employerAuthSubscription.unsubscribe();
  }
}

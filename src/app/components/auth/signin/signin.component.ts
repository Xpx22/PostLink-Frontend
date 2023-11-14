import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../services/auth.service";

@Component({
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  encapsulation: ViewEncapsulation.None
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

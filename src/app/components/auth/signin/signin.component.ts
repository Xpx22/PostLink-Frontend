import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
})
export class SignInComponent implements OnInit, OnDestroy {
  isLoading = false;
  private isUserAuthenticated = false;
  private isEmployerAuthenticated = false;
  private userAuthSubscription = new Subscription();
  private employerAuthSubscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userAuthSubscription = this.authService
      .getUserAuthStateListener()
      .subscribe((isAuthenticated: boolean) => {
        this.isUserAuthenticated = isAuthenticated;
      });
    this.employerAuthSubscription = this.authService
      .getEmployerAuthStateListener()
      .subscribe((isAuthenticated: boolean) => {
        this.isEmployerAuthenticated = isAuthenticated;
      });
  }

  onSignIn(form: NgForm) {
    if (form.invalid) {
      return;
    }
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

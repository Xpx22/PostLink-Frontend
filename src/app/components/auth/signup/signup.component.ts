import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorDialog } from '../../error-dialog/error.component';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  isEmployer = false;
  isChecked() {
    this.isEmployer = !this.isEmployer;
  }
  private isUserAuthenticated = false;
  private isEmployerAuthenticated = false;
  private userAuthSubscription = new Subscription();
  private employerAuthSubscription = new Subscription();

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userAuthSubscription = this.authService
      .getUserAuthStateListener()
      .subscribe((isUserAuth: boolean) => {
        this.isUserAuthenticated = isUserAuth;
      });
    this.employerAuthSubscription = this.authService
      .getEmployerAuthStateListener()
      .subscribe((isEmployerAuth: boolean) => {
        this.isEmployerAuthenticated = isEmployerAuth;
      });
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const pw = form.value.password;
    if (form.value.passwordConfirm !== pw) {
      this.dialog.open(ErrorDialog, {
        data: {
          type: 'Sign up information error!',
          message: 'Password and password confirmation does not match!',
        },
      });
      return;
    }
    this.isLoading = true;
    this.authService.signUp(email, pw, this.isEmployer);
    if (this.isUserAuthenticated || this.isEmployerAuthenticated) {
      this.isLoading = false;
      form.resetForm();
    }
  }

  ngOnDestroy(): void {
    this.userAuthSubscription.unsubscribe();
    this.employerAuthSubscription.unsubscribe();
  }
}

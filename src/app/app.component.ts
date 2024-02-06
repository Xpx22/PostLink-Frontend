import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    NgIf,
    NgFor,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidenavOpen = false;
  brand = 'PostLink';
  signinText = 'Sign In';
  signOutText = 'Sign out';
  userChoices: { text: string; nav: string }[] = [
    { text: 'Account', nav: '/users/account' },
    { text: 'Dashboard', nav: '/users/dashboard' },
    { text: 'Bookmarks', nav: '/users/bookmarks' },
  ];
  employerChoices: { text: string; nav: string }[] = [
    { text: 'Account', nav: 'employers/account' },
    { text: 'Dashboard', nav: '/employers/dashboard' },
    { text: 'Post a job', nav: '/employers/create' },
  ];
  private userAuthSubscription = new Subscription();
  private employerAuthSubscription = new Subscription();
  userIsAuthenticated = false;
  employerIsAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userAuthSubscription = this.authService
      .getUserAuthStateListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.employerAuthSubscription = this.authService
      .getEmployerAuthStateListener()
      .subscribe((isAuthenticated) => {
        this.employerIsAuthenticated = isAuthenticated;
      });
    this.authService.refreshToken();
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  onSignOut() {
    this.authService.signOut();
    this.isSidenavOpen = false;
  }

  ngOnDestroy() {
    this.userAuthSubscription.unsubscribe();
    this.employerAuthSubscription.unsubscribe();
  }
}

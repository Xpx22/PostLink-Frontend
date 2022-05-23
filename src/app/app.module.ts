import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatListModule } from "@angular/material/list";

import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AppRoutingModule } from './app-routing.module';
import { UserAccountComponent } from './components/users/user/user-account/user-account.component';
import { UserDashboardComponent } from './components/users/user/user-dashboard/user-dashboard.component';
import { UserBookmarkComponent } from './components/users/user/user-bookmark/user-bookmark.component';
import { EmployerAccountComponent } from './components/users/employer/employer-account/employer-account.component';
import { EmployerDashboardComponent } from './components/users/employer/employer-dashboard/employer-dashboard.component';
//import { JobsListComponent } from './jobs/NO-jobs-list/jobs-list.component';
import { JobDetailComponent } from './components/jobs/job-detail/job-detail.component';
import { JobCreateComponent } from './components/jobs/job-create/job-create.component';
import { SignUpComponent } from './components/auth/signup/signup.component';
import { SignInComponent } from './components/auth/signin/signin.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { ErrorDialog } from './components/error-dialog/error.component';
import { SuccessDialog } from './components/success-dialog/success.component';
import { EmployerEditJobComponent } from './components/users/employer/employer-edit-job/employer-edit-job.component';
import { ConfirmDialog } from './components/confirm-dialog/confirm.component';
import { EmployerDashboardJobDetailComponent } from './components/users/employer/employer-dashboard-jobdetail/employer-dashboard-jobdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SignUpComponent,
    SignInComponent,
    UserAccountComponent,
    UserDashboardComponent,
    UserBookmarkComponent,
    EmployerAccountComponent,
    EmployerDashboardComponent,
    EmployerEditJobComponent,
    //JobsListComponent,
    JobDetailComponent,
    JobCreateComponent,
    ErrorDialog,
    SuccessDialog,
    ConfirmDialog,
    EmployerDashboardJobDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialog, SuccessDialog, ConfirmDialog] //for Offline Template Compiler
  /*
  Offline template compiler (OTC) only builds components that are actually used.
  If components aren't used in templates directly the OTC can't know whether they need to be compiled.
  With entryComponents you can tell the OTC to also compile this components so they are available at runtime.
  */
})
export class AppModule { }

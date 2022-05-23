import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MainPageComponent } from "./components/main-page/main-page.component";
import { SignUpComponent } from "./components/auth/signup/signup.component";
import { SignInComponent } from "./components/auth/signin/signin.component";
import { UserAccountComponent } from "./components/users/user/user-account/user-account.component";
import { UserDashboardComponent } from "./components/users/user/user-dashboard/user-dashboard.component";
import { UserBookmarkComponent } from "./components/users/user/user-bookmark/user-bookmark.component";
import { EmployerAccountComponent } from "./components/users/employer/employer-account/employer-account.component";
import { EmployerDashboardComponent } from "./components/users/employer/employer-dashboard/employer-dashboard.component";
import { JobDetailComponent } from "./components/jobs/job-detail/job-detail.component";
import { JobCreateComponent } from "./components/jobs/job-create/job-create.component";
import { UserAuthGuard } from "./guards/user-auth-guard";
import { EmployerAuthGuard } from "./guards/employer-auth-guard";
import { OneLoginGuard } from "./guards/one-login-guard";
import { EmployerAccountDataGuard } from "./guards/employer-accountdata-guard";
import { EmployerEditJobComponent } from "./components/users/employer/employer-edit-job/employer-edit-job.component";
import { EmployerAuthorizeGuard } from "./guards/Employer-authorize-guard";
import { EmployerDashboardJobDetailComponent } from "./components/users/employer/employer-dashboard-jobdetail/employer-dashboard-jobdetail.component";



const routes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "signup", component: SignUpComponent},
  { path: "signin", component: SignInComponent, canActivate: [OneLoginGuard] },
  { path: "jobdetails/:id", component: JobDetailComponent },
  // {
  //   path: "users",
  //   component: UserProfileComponent,
  //   canActivate: [UserAuthGuard],
  //   children: [
  //     { path: "profile", component: UserProfileComponent, canActivate: [UserAuthGuard] },
  //     { path: "account", component: UserAccountComponent, canActivate: [UserAuthGuard] },
  //     { path: "dashboard", component: UserDashboardComponent, canActivate: [UserAuthGuard] },
  //     { path: "bookmarks", component: UserBookmarkComponent, canActivate: [UserAuthGuard] },
  //   ]
  // },
  { path: "users/account", component: UserAccountComponent, canActivate: [UserAuthGuard] },
  { path: "users/dashboard", component: UserDashboardComponent, canActivate: [UserAuthGuard] },
  { path: "users/bookmarks", component: UserBookmarkComponent, canActivate: [UserAuthGuard] },
  { path: "employers/account", component: EmployerAccountComponent, canActivate: [EmployerAuthGuard] },
  { path: "employers/dashboard", component: EmployerDashboardComponent, canActivate: [EmployerAuthGuard] },
  { path: "employers/create", component: JobCreateComponent, canActivate: [EmployerAuthGuard] },
  { path: "employers/editjob/:id", component: EmployerEditJobComponent, canActivate: [EmployerAuthGuard, EmployerAuthorizeGuard] },
  { path: "employers/dashboard/:id/jobdetails", component: EmployerDashboardJobDetailComponent, canActivate: [EmployerAuthGuard] },
  { path: "**", redirectTo: "/"}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [UserAuthGuard, EmployerAuthGuard, OneLoginGuard, EmployerAccountDataGuard, EmployerAuthorizeGuard]
})

export class AppRoutingModule{}

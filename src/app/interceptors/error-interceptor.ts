import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, Observable, throwError } from "rxjs";

import { ErrorDialog } from "../components/error-dialog/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private dialog: MatDialog){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        let errorMessage = "An error has occured!";
        if(error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorDialog, {
          data: {
            type: "Unknown error!",
            message: errorMessage
          }
        });
        return throwError(error);
      })
    );
  }
}

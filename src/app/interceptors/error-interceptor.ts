import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ErrorDialog } from "../components/error-dialog/error.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable, catchError, throwError } from "rxjs";

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

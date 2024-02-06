import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.scss"],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule]
})

export class ErrorDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      message: string
  }){}
}

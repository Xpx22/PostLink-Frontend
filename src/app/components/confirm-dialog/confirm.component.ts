import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
    templateUrl: "./confirm.component.html",
    styleUrls: ["./confirm.component.scss"],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule]
})

export class ConfirmDialog{
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA)public confirmData: {
      type: string,
      message: string
  }){}

  onYesClick(){}
}

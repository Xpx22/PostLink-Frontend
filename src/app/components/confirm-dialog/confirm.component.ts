import { Component, Inject } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.scss"]
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

import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.scss"]
})

export class SuccessDialog{
  constructor(
    @Inject(MAT_DIALOG_DATA)public successData: {
      type: string,
      message: string
  }){}
}

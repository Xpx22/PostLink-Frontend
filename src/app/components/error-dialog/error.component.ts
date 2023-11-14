import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"]
})

export class ErrorDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      message: string
  }){}
}

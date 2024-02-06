import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";

@Component({
    templateUrl: "./success.component.html",
    styleUrls: ["./success.component.scss"],
    standalone: true,
    imports: [MatLegacyDialogModule, MatLegacyButtonModule]
})

export class SuccessDialog{
  constructor(
    @Inject(MAT_DIALOG_DATA)public successData: {
      type: string,
      message: string
  }){}
}

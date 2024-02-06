import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";

@Component({
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.scss"],
    standalone: true,
    imports: [MatLegacyDialogModule, MatLegacyButtonModule]
})

export class ErrorDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      message: string
  }){}
}

import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class SuccessDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public successData: {
      type: string;
      message: string;
    }
  ) {}
}

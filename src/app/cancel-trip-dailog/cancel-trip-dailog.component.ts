import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-trip-dailog',
  templateUrl: './cancel-trip-dailog.component.html',
  styleUrls: ['./cancel-trip-dailog.component.scss']
})
export class CancelTripDailogComponent {
  constructor(

    public dialogRef: MatDialogRef<CancelTripDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  close(): void {
    this.dialogRef.close();
  }
}

import { Injectable } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { JoinTripDailogComponent } from 'src/app/join-trip-dailog/join-trip-dailog.component';
import { CancelTripDailogComponent } from 'src/app/cancel-trip-dailog/cancel-trip-dailog.component';
import { ShareDialogComponent } from 'src/app/share-dialog/share-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DataEntryDialogService {

  constructor(private dialog: MatDialog) { }
  
  openSignDialogComponent(tripid): MatDialogRef<JoinTripDailogComponent> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { tripid };
    dialogConfig.disableClose = true;
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '450px';
    dialogConfig.maxHeight = '75vh';
    dialogConfig.enterAnimationDuration = '85%';
    dialogConfig.panelClass = ['center-smpliey'];
    return this.dialog.open(JoinTripDailogComponent, dialogConfig);
  }
  CancelTripDailogComponent(): MatDialogRef<CancelTripDailogComponent> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '450px';
    dialogConfig.maxHeight = '75vh';
    dialogConfig.enterAnimationDuration = '85%';
    dialogConfig.panelClass = ['center-smpliey'];
    return this.dialog.open(CancelTripDailogComponent, dialogConfig);
  }
  openShareDialogComponent(): MatDialogRef<ShareDialogComponent> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '450px';
    dialogConfig.maxHeight = '75vh';
    dialogConfig.enterAnimationDuration = '85%';
    dialogConfig.panelClass = ['center-smpliey'];
    return this.dialog.open(ShareDialogComponent, dialogConfig);
  }
  
} 

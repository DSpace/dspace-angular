import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingDialogRef: MatDialogRef<any>;

  constructor(private dialog: MatDialog,
    private router: Router,
) { 
}

  openLoadingDialog(message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '100%';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.panelClass = ['loader-dialog'];
    dialogConfig.data = {
      message: message,
    };
    // this.loadingDialogRef = this.dialog.open(
    //   // LoadingDialogComponent,
    //   dialogConfig,
    // );
  }

  closeLoadingDialog() {
    if (!!this.loadingDialogRef) {
      this.loadingDialogRef.close();
    }
  }

  allowClosing(backWhenClosed?: boolean) : EventEmitter<any> {
    this.loadingDialogRef.componentInstance.ready = true;
    this.loadingDialogRef.componentInstance.backWhenClosed = backWhenClosed;
    this.loadingDialogRef.disableClose = false;
    this.loadingDialogRef.componentInstance.buttonLabel = 'Close';
    return;
  }

  changeDialogMessage(message: string) {
    this.loadingDialogRef.componentInstance.message = message;
  }

  finalizeMessage(message: string, backWhenClosed?: boolean) {
    if (!this.loadingDialogRef || !this.loadingDialogRef.componentInstance) {
      this.openLoadingDialog(message);
    } else {
      this.loadingDialogRef.componentInstance.message = message;
    }
    this.allowClosing(backWhenClosed);
  }

  closingMessage(message: string) : EventEmitter<any> {
    if (!!this.loadingDialogRef) {
      this.loadingDialogRef.componentInstance.message = message;
      this.allowClosing(false);
      return this.loadingDialogRef.componentInstance.forwardingEmitter;
    }
  }

  errorMessage(message, backWhenClosed?: boolean) {
    // this.closeLoadingDialog();
    if (!message) {
      this.finalizeMessage('Ooops something went wrong. Please try again.');
    } else {
      this.finalizeMessage(message);
    }
  }
}
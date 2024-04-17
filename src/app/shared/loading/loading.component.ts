import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { hasValue } from '../empty.util';
import { environment } from '../../../environments/environment';
import { AlertType } from '../alert/alert-type';

enum MessageType {
  LOADING = 'loading',
  WARNING = 'warning',
  ERROR = 'error'
}

@Component({
  selector: 'ds-loading',
  styleUrls: ['./loading.component.scss'],
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnDestroy, OnInit {

  @Input() message: string;
  @Input() showMessage = true;

  @Input() enableFallbackMessages = environment.loader.enableFallbackMessagesByDefault;
  @Input() warningMessage: string;
  @Input() warningMessageDelay = environment.loader.warningMessageDelay;
  @Input() errorMessage: string;
  @Input() errorMessageDelay = environment.loader.errorMessageDelay;

  /**
   * Show a more compact spinner animation instead of the default one
   */
  @Input() spinner = false;

  readonly MessageType = MessageType;
  messageToShow: MessageType = this.showMessage ? MessageType.LOADING : undefined;

  private subscriptions: Subscription[] = [];

  warningTimeout: any;
  errorTimeout: any;

  readonly AlertTypeEnum = AlertType;

  constructor(private translate: TranslateService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.showMessage && this.message === undefined) {
      this.subscriptions.push(this.translate.get('loading.default').subscribe((message: string) => {
        this.message = message;
      }));
    }
    if (this.enableFallbackMessages) {
      if (!this.warningMessage) {
        this.subscriptions.push(this.translate.get('loading.warning').subscribe((warningMessage: string) => {
          this.warningMessage = warningMessage;
        }));
      }
      if (!this.errorMessage) {
        this.subscriptions.push(this.translate.get('loading.error').subscribe((errorMessage: string) => {
          this.errorMessage = errorMessage;
        }));
      }
      if (this.warningMessageDelay > 0) {
        this.warningTimeout = setTimeout(() => {
          this.messageToShow = MessageType.WARNING;
          this.changeDetectorRef.detectChanges();
        }, this.warningMessageDelay);
      }
      if (this.errorMessageDelay > 0) {
        this.errorTimeout = setTimeout(() => {
          this.messageToShow = MessageType.ERROR;
          this.changeDetectorRef.detectChanges();
        }, this.errorMessageDelay);
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
    }
    if (hasValue(this.warningTimeout)) {
      clearTimeout(this.warningTimeout);
    }
    if (hasValue(this.errorTimeout)) {
      clearTimeout(this.errorTimeout);
    }
  }
}

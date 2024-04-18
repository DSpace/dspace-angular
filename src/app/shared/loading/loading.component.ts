import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

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

  @Input() showFallbackMessages = environment.loader.showFallbackMessagesByDefault;
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

  warningTimeout: any;
  errorTimeout: any;

  readonly AlertTypeEnum = AlertType;

  constructor(private translate: TranslateService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.showMessage) {
      this.message = this.message || this.translate.instant('loading.default');
    }
    if (this.showFallbackMessages) {
      this.warningMessage = this.warningMessage || this.translate.instant('loading.warning');
      this.errorMessage = this.errorMessage || this.translate.instant('loading.error');
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
    if (hasValue(this.warningTimeout)) {
      clearTimeout(this.warningTimeout);
    }
    if (hasValue(this.errorTimeout)) {
      clearTimeout(this.errorTimeout);
    }
  }
}

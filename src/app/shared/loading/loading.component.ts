import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { hasValue } from '../empty.util';
import { environment } from '../../../environments/environment';
import { AlertType } from '../alert/alert-type';
import { Router } from '@angular/router';
import { isPlatformBrowser, Location } from '@angular/common';

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

  readonly QUERY_PARAM_RELOAD_COUNT = 'reloadCount';

  @Input() message: string;
  @Input() showMessage = true;

  @Input() showFallbackMessages = environment.loader.showFallbackMessagesByDefault;
  @Input() warningMessage: string;
  @Input() warningMessageDelay = environment.loader.warningMessageDelay;
  @Input() errorMessage: string;
  @Input() errorMessageDelay = environment.loader.errorMessageDelay;
  errorTimeoutWithRetriesDelay = environment.loader.errorMessageDelay;

  @Input() numberOfAutomaticPageReloads = environment.loader.numberOfAutomaticPageReloads || 0;

  /**
   * Show a more compact spinner animation instead of the default one
   */
  @Input() spinner = false;

  readonly MessageType = MessageType;
  messageToShow: MessageType = this.showMessage ? MessageType.LOADING : undefined;

  warningTimeout: any;
  errorTimeout: any;

  pageReloadCount = 0;

  readonly AlertTypeEnum = AlertType;

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    // saving current url and query params for the upcoming router trick
    let currentUrl = this.router.url.split('?')[0];
    const queryParams = new URLSearchParams(this.router.url.split('?')[1]);

    // get reload count from state
    const reloadCount = (this.location.getState() as any)?.[this.QUERY_PARAM_RELOAD_COUNT];
    if (hasValue(reloadCount)) {
      this.pageReloadCount = +reloadCount;
    }

    // calculate the delay for the error message with retries
    this.errorTimeoutWithRetriesDelay = this.errorMessageDelay + this.pageReloadCount * (this.errorMessageDelay - this.warningMessageDelay);

    if (this.showMessage) {
      this.message = this.message || this.translate.instant('loading.default');
    }

    if (this.showFallbackMessages && isPlatformBrowser(this.platformId)) {
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
          // if the page has been reloaded less than the maximum number of retries
          if (this.pageReloadCount < this.numberOfAutomaticPageReloads) {
            this.pageReloadCount++;
            // navigate to a fake url to trigger a reload of the current page
            // this is needed because the router does not reload the page if the url is the same,
            // even if the state changes and the onSameUrlNavigation property is set to 'reload'
            this.router.navigate(['/fake-url'], {queryParams, queryParamsHandling: 'merge', skipLocationChange: true}).then(() => {
              // navigate back to the current url
              this.router.navigate([currentUrl], {
                queryParams,
                queryParamsHandling: 'merge',
                onSameUrlNavigation: 'reload',
                state: {[this.QUERY_PARAM_RELOAD_COUNT]: this.pageReloadCount}
              });
            });
          } else {
            // if the page has been reloaded the maximum number of retries
            this.messageToShow = MessageType.ERROR;
            this.changeDetectorRef.detectChanges();
          }
        }, this.errorTimeoutWithRetriesDelay);
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SuggestionsService } from '../suggestions.service';
import { takeUntil } from 'rxjs/operators';
import { OpenaireSuggestionTarget } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'ds-suggestions-popup',
  templateUrl: './suggestions-popup.component.html',
  styleUrls: ['./suggestions-popup.component.scss']
})
export class SuggestionsPopupComponent implements OnInit, OnDestroy {

  labelPrefix = 'mydspace.';

  subscription;

  constructor(
    private translateService: TranslateService,
    private reciterSuggestionStateService: SuggestionTargetsStateService,
    private notificationsService: NotificationsService,
    private suggestionsService: SuggestionsService
  ) { }

  ngOnInit() {
    this.initializePopup();
  }

  public initializePopup() {
    const notifier = new Subject();
    this.subscription = combineLatest([
      this.reciterSuggestionStateService.getCurrentUserSuggestionTargets(),
      this.reciterSuggestionStateService.hasUserVisitedSuggestions()
    ]).pipe(takeUntil(notifier)).subscribe(([suggestions, visited]) => {
      if (isNotEmpty(suggestions)) {
        if (!visited) {
          suggestions.forEach((suggestionTarget: OpenaireSuggestionTarget) => this.showNotificationForNewSuggestions(suggestionTarget));
          this.reciterSuggestionStateService.dispatchMarkUserSuggestionsAsVisitedAction();
          notifier.next();
          notifier.complete();
        }
      }
    });
  }

  /**
   * Show a notification to user for a new suggestions detected
   * @param suggestionTarget
   * @private
   */
  private showNotificationForNewSuggestions(suggestionTarget: OpenaireSuggestionTarget): void {
    const content = this.translateService.instant(this.labelPrefix + 'notification.suggestion',
      this.suggestionsService.getNotificationSuggestionInterpolation(suggestionTarget));
    this.notificationsService.success('', content, {timeOut:0}, true);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

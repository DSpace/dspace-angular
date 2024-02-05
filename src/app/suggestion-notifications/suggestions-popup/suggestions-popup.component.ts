import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SuggestionsService } from '../suggestions.service';
import { take, takeUntil } from 'rxjs/operators';
import { SuggestionTarget } from '../../core/suggestion-notifications/models/suggestion-target.model';
import { isNotEmpty } from '../../shared/empty.util';
import { combineLatest, Subject } from 'rxjs';

/**
 * Show suggestions on a popover window, used on the homepage
 */
@Component({
  selector: 'ds-suggestions-popup',
  templateUrl: './suggestions-popup.component.html',
  styleUrls: ['./suggestions-popup.component.scss']
})
export class SuggestionsPopupComponent implements OnInit, OnDestroy {

  labelPrefix = 'notification.';

  subscription;

  constructor(
    private translateService: TranslateService,
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private notificationsService: NotificationsService,
    private suggestionsService: SuggestionsService
  ) { }

  ngOnInit() {
    this.initializePopup();
  }

  public initializePopup() {
    const notifier = new Subject();
    this.subscription = combineLatest([
      this.suggestionTargetsStateService.getCurrentUserSuggestionTargets().pipe(take(2)),
      this.suggestionTargetsStateService.hasUserVisitedSuggestions()
    ]).pipe(takeUntil(notifier)).subscribe(([suggestions, visited]) => {
      this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
      if (isNotEmpty(suggestions)) {
        if (!visited) {
          suggestions.forEach((suggestionTarget: SuggestionTarget) => this.showNotificationForNewSuggestions(suggestionTarget));
          this.suggestionTargetsStateService.dispatchMarkUserSuggestionsAsVisitedAction();
          notifier.next(null);
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
  private showNotificationForNewSuggestions(suggestionTarget: SuggestionTarget): void {
    const content = this.translateService.instant(this.labelPrefix + 'suggestion',
      this.suggestionsService.getNotificationSuggestionInterpolation(suggestionTarget));
    this.notificationsService.success('', content, {timeOut:0}, true);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

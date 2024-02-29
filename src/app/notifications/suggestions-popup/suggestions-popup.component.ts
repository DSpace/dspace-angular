import { Component, OnDestroy, OnInit } from '@angular/core';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from '../suggestions.service';
import { take, takeUntil } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { trigger } from '@angular/animations';


import { fromTopEnter } from '../../shared/animations/fromTop';
import { SuggestionTarget } from '../../core/notifications/models/suggestion-target.model';

/**
 * Show suggestions on a popover window, used on the homepage
 */
@Component({
  selector: 'ds-suggestions-popup',
  templateUrl: './suggestions-popup.component.html',
  styleUrls: ['./suggestions-popup.component.scss'],
  animations: [
    trigger('enterLeave', [
      fromTopEnter
    ])
  ],
})
export class SuggestionsPopupComponent implements OnInit, OnDestroy {

  labelPrefix = 'notification.';

  subscription;

  suggestionsRD$: Observable<SuggestionTarget[]>;


  constructor(
    private suggestionTargetsStateService: SuggestionTargetsStateService,
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
          this.suggestionsRD$ = of(suggestions);
          this.suggestionTargetsStateService.dispatchMarkUserSuggestionsAsVisitedAction();
          notifier.next(null);
          notifier.complete();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Interpolated params to build the notification suggestions notification.
   * @param suggestionTarget
   */
  public getNotificationSuggestionInterpolation(suggestionTarget: SuggestionTarget): any {
    return this.suggestionsService.getNotificationSuggestionInterpolation(suggestionTarget);
  }

  /**
   * Hide popup from view
   */
  public removePopup() {
    this.suggestionsRD$ = null;
  }
}

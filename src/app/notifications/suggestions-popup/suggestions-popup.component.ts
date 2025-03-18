import { trigger } from '@angular/animations';
import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  take,
  takeUntil,
} from 'rxjs/operators';

import { SuggestionTarget } from '../../core/notifications/suggestions/models/suggestion-target.model';
import { fromTopEnter } from '../../shared/animations/fromTop';
import { isNotEmpty } from '../../shared/empty.util';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from '../suggestions.service';

/**
 * Show suggestions on a popover window, used on the homepage
 */
@Component({
  selector: 'ds-suggestions-popup',
  templateUrl: './suggestions-popup.component.html',
  styleUrls: ['./suggestions-popup.component.scss'],
  animations: [
    trigger('enterLeave', [
      fromTopEnter,
    ]),
  ],
  imports: [
    AsyncPipe,
    TranslateModule,
    RouterLink,
    NgIf,
    NgForOf,
  ],
  standalone: true,
})
export class SuggestionsPopupComponent implements OnInit, OnDestroy {

  labelPrefix = 'notification.';

  subscription: Subscription;

  suggestionsRD$: Observable<SuggestionTarget[]>;


  constructor(
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionsService: SuggestionsService,
  ) { }

  ngOnInit() {
    this.initializePopup();
  }

  public initializePopup() {
    const notifier = new Subject();
    this.subscription = combineLatest([
      this.suggestionTargetsStateService.getCurrentUserSuggestionTargets().pipe(take(2)),
      this.suggestionTargetsStateService.hasUserVisitedSuggestions(),
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

import { Component, OnInit } from '@angular/core';
<<<<<<<< HEAD:src/app/notifications/reciter-suggestions/suggestions-notification/suggestions-notification.component.ts
import { SuggestionTarget } from '../../../core/notifications/reciter-suggestions/models/suggestion-target.model';
import { TranslateService } from '@ngx-translate/core';
========
import { SuggestionTarget } from '../../core/suggestion-notifications/models/suggestion-target.model';
>>>>>>>> main:src/app/notifications/suggestions-notification/suggestions-notification.component.ts
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from '../suggestions.service';
import { Observable } from 'rxjs';

/**
 * Show suggestions notification, used on myDSpace and Profile pages
 */
@Component({
  selector: 'ds-suggestions-notification',
  templateUrl: './suggestions-notification.component.html',
  styleUrls: ['./suggestions-notification.component.scss']
})
export class SuggestionsNotificationComponent implements OnInit {

  /**
   * The user suggestion targets.
   */
  suggestionsRD$: Observable<SuggestionTarget[]>;

  constructor(
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionsService: SuggestionsService
  ) { }

  ngOnInit() {
    this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
    this.suggestionsRD$ = this.suggestionTargetsStateService.getCurrentUserSuggestionTargets();
  }

  /**
   * Interpolated params to build the notification suggestions notification.
   * @param suggestionTarget
   */
  public getNotificationSuggestionInterpolation(suggestionTarget: SuggestionTarget): any {
    return this.suggestionsService.getNotificationSuggestionInterpolation(suggestionTarget);
  }

}

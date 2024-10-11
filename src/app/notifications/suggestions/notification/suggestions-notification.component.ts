import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { SuggestionTarget } from '../../../core/notifications/suggestions/models/suggestion-target.model';
import { SuggestionsService } from '../suggestions.service';
import { SuggestionTargetsStateService } from '../targets/suggestion-targets.state.service';

/**
 * Show suggestions notification, used on myDSpace and Profile pages
 */
@Component({
  selector: 'ds-suggestions-notification',
  templateUrl: './suggestions-notification.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
  styleUrls: ['./suggestions-notification.component.scss'],
})
export class SuggestionsNotificationComponent implements OnInit {

  /**
   * The user suggestion targets.
   */
  suggestionsRD$: Observable<SuggestionTarget[]>;

  constructor(
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionsService: SuggestionsService,
  ) { }

  ngOnInit() {
    this.suggestionsRD$ = this.suggestionTargetsStateService.getCurrentUserSuggestionTargets();
    this.suggestionTargetsStateService.dispatchMarkUserSuggestionsAsVisitedAction();
  }

  /**
   * Interpolated params to build the notification suggestions notification.
   * @param suggestionTarget
   */
  public getNotificationSuggestionInterpolation(suggestionTarget: SuggestionTarget): any {
    return this.suggestionsService.getNotificationSuggestionInterpolation(suggestionTarget);
  }

}

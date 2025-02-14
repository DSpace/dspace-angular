import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { SuggestionTarget } from '../../core/notifications/suggestions/models/suggestion-target.model';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from '../suggestions.service';

/**
 * Show suggestions notification, used on myDSpace and Profile pages
 */
@Component({
  selector: 'ds-suggestions-notification',
  templateUrl: './suggestions-notification.component.html',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    AsyncPipe,
    NgIf,
    NgForOf,
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

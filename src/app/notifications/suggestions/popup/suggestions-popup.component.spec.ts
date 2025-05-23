import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { mockSuggestionTargetsObjectOne } from '../../../shared/mocks/publication-claim-targets.mock';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { SuggestionsService } from '../suggestions.service';
import { SuggestionTargetsStateService } from '../targets/suggestion-targets.state.service';
import { SuggestionsPopupComponent } from './suggestions-popup.component';

describe('SuggestionsPopupComponent', () => {
  let component: SuggestionsPopupComponent;
  let fixture: ComponentFixture<SuggestionsPopupComponent>;

  const suggestionStateService = jasmine.createSpyObj('SuggestionTargetsStateService', {
    hasUserVisitedSuggestions: jasmine.createSpy('hasUserVisitedSuggestions'),
    getCurrentUserSuggestionTargets: jasmine.createSpy('getCurrentUserSuggestionTargets'),
    dispatchMarkUserSuggestionsAsVisitedAction: jasmine.createSpy('dispatchMarkUserSuggestionsAsVisitedAction'),
    dispatchRefreshUserSuggestionsAction: jasmine.createSpy('dispatchRefreshUserSuggestionsAction'),
  });

  const mockNotificationInterpolation = { count: 12, source: 'source', suggestionId: 'id', displayName: 'displayName' };
  const suggestionService = jasmine.createSpyObj('SuggestionService', {
    getNotificationSuggestionInterpolation:
      jasmine.createSpy('getNotificationSuggestionInterpolation').and.returnValue(mockNotificationInterpolation),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SuggestionsPopupComponent],
      providers: [
        { provide: SuggestionTargetsStateService, useValue: suggestionStateService },
        { provide: SuggestionsService, useValue: suggestionService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  describe('should create', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(SuggestionsPopupComponent);
      component = fixture.componentInstance;
      spyOn(component, 'initializePopup').and.returnValue(null);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.initializePopup).toHaveBeenCalled();
    });

  });

  describe('when there are publication suggestions', () => {

    beforeEach(() => {
      suggestionStateService.hasUserVisitedSuggestions.and.returnValue(of(false));
      suggestionStateService.getCurrentUserSuggestionTargets.and.returnValue(of([mockSuggestionTargetsObjectOne]));
      suggestionStateService.dispatchMarkUserSuggestionsAsVisitedAction.and.returnValue(of(null));
      suggestionStateService.dispatchRefreshUserSuggestionsAction.and.returnValue(of(null));

      fixture = TestBed.createComponent(SuggestionsPopupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show a notification when new publication suggestions are available', () => {
      expect(suggestionStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
      expect(suggestionStateService.dispatchMarkUserSuggestionsAsVisitedAction).toHaveBeenCalled();
    });

  });
});

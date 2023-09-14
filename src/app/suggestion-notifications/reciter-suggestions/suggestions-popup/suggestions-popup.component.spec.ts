import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsPopupComponent } from './suggestions-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { SuggestionTargetsStateService } from '../suggestion-targets/suggestion-targets.state.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { mockSuggestionTargetsObjectOne } from '../../../shared/mocks/reciter-suggestion-targets.mock';
import { SuggestionsService } from '../suggestions.service';

describe('SuggestionsPopupComponent', () => {
  let component: SuggestionsPopupComponent;
  let fixture: ComponentFixture<SuggestionsPopupComponent>;

  const suggestionStateService = jasmine.createSpyObj('SuggestionTargetsStateService', {
    hasUserVisitedSuggestions: jasmine.createSpy('hasUserVisitedSuggestions'),
    getCurrentUserSuggestionTargets: jasmine.createSpy('getCurrentUserSuggestionTargets'),
    dispatchMarkUserSuggestionsAsVisitedAction: jasmine.createSpy('dispatchMarkUserSuggestionsAsVisitedAction')
  });

  const mockNotificationInterpolation = { count: 12, source: 'source', suggestionId: 'id', displayName: 'displayName' };
  const suggestionService = jasmine.createSpyObj('SuggestionService', {
    getNotificationSuggestionInterpolation:
      jasmine.createSpy('getNotificationSuggestionInterpolation').and.returnValue(mockNotificationInterpolation)
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ SuggestionsPopupComponent ],
      providers: [
        { provide: SuggestionTargetsStateService, useValue: suggestionStateService },
        { provide: SuggestionsService, useValue: suggestionService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA]

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

      suggestionStateService.hasUserVisitedSuggestions.and.returnValue(observableOf(false));
      suggestionStateService.getCurrentUserSuggestionTargets.and.returnValue(observableOf([mockSuggestionTargetsObjectOne]));
      suggestionStateService.dispatchMarkUserSuggestionsAsVisitedAction.and.returnValue(observableOf(null));

      fixture = TestBed.createComponent(SuggestionsPopupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show a notification when new publication suggestions are available', () => {
      expect((component as any).notificationsService.success).toHaveBeenCalled();
      expect(suggestionStateService.dispatchMarkUserSuggestionsAsVisitedAction).toHaveBeenCalled();
    });

  });
});

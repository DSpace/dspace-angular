import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SuggestionListElementComponent } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { getMockOpenaireStateService, getMockSuggestionsService } from '../shared/mocks/openaire.mock';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { OpenaireSuggestion } from '../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { mockSuggestionPublicationOne, mockSuggestionPublicationTwo } from '../shared/mocks/reciter-suggestion.mock';
import { SuggestionEvidencesComponent } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { ObjectKeysPipe } from '../shared/utils/object-keys-pipe';
import { VarDirective } from '../shared/utils/var.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../shared/testing/router.stub';
import { mockSuggestionTargetsObjectOne } from '../shared/mocks/reciter-suggestion-targets.mock';
import { AuthService } from '../core/auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { getMockTranslateService } from '../shared/mocks/translate.service.mock';
import { SuggestionTargetsStateService } from '../openaire/reciter-suggestions/suggestion-targets/suggestion-targets.state.service';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { PageInfo } from '../core/shared/page-info.model';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import { PaginationService } from '../core/pagination/pagination.service';

describe('SuggestionPageComponent', () => {
  let component: SuggestionsPageComponent;
  let fixture: ComponentFixture<SuggestionsPageComponent>;
  let scheduler: TestScheduler;
  const mockSuggestionsService = getMockSuggestionsService();
  const mockSuggestionsTargetStateService = getMockOpenaireStateService();
  const suggestionTargetsList: PaginatedList<OpenaireSuggestion> = buildPaginatedList(new PageInfo(), [mockSuggestionPublicationOne, mockSuggestionPublicationTwo]);
  const router = new RouterStub();
  const routeStub = {
    data: observableOf({
      suggestionTargets: createSuccessfulRemoteDataObject(mockSuggestionTargetsObjectOne)
    }),
    queryParams: observableOf({})
  };
  const workspaceitemServiceMock = jasmine.createSpyObj('WorkspaceitemDataService', {
    importExternalSourceEntry: jasmine.createSpy('importExternalSourceEntry')
  });

  const authService = jasmine.createSpyObj('authService', {
    isAuthenticated: observableOf(true),
    setRedirectUrl: {}
  });
  const paginationService = new PaginationServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        SuggestionEvidencesComponent,
        SuggestionListElementComponent,
        SuggestionsPageComponent,
        ObjectKeysPipe,
        VarDirective
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: WorkspaceitemDataService, useValue: workspaceitemServiceMock },
        { provide: Router, useValue: router },
        { provide: SuggestionsService, useValue: mockSuggestionsService },
        { provide: SuggestionTargetsStateService, useValue: mockSuggestionsTargetStateService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: PaginationService, useValue: paginationService },
        SuggestionsPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsPageComponent);
    component = fixture.componentInstance;
    scheduler = getTestScheduler();
  });

  it('should create', () => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    expect(component).toBeTruthy();
    expect(component.suggestionId).toBe(mockSuggestionTargetsObjectOne.id);
    expect(component.researcherName).toBe(mockSuggestionTargetsObjectOne.display);
    expect(component.updatePage).toHaveBeenCalled();
  });
});

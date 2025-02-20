import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AuthService } from '../core/auth/auth.service';
import { getMockTranslateService } from '../core/mocks/translate.service.mock';
import { NotificationsService } from '../core/notifications/notifications.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { createSuccessfulRemoteDataObject } from '../core/utilities/remote-data.utils';
import { NotificationsServiceStub } from '../core/utilities/testing/notifications-service.stub';
import { PaginationServiceStub } from '../core/utilities/testing/pagination-service.stub';
import { RouterStub } from '../core/utilities/testing/router.stub';
import { SuggestionApproveAndImport } from '../notifications/suggestion-list-element/suggestion-approve-and-import';
import { SuggestionEvidencesComponent } from '../notifications/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { SuggestionListElementComponent } from '../notifications/suggestion-list-element/suggestion-list-element.component';
import { SuggestionTargetsStateService } from '../notifications/suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from '../notifications/suggestions.service';
import {
  mockSuggestionPublicationOne,
  mockSuggestionPublicationTwo,
} from '../shared/mocks/publication-claim.mock';
import { mockSuggestionTargetsObjectOne } from '../shared/mocks/publication-claim-targets.mock';
import {
  getMockSuggestionNotificationsStateService,
  getMockSuggestionsService,
} from '../shared/mocks/suggestion.mock';
import { ObjectKeysPipe } from '../shared/utils/object-keys-pipe';
import { VarDirective } from '../shared/utils/var.directive';
import { SuggestionsPageComponent } from './suggestions-page.component';

describe('SuggestionPageComponent', () => {
  let component: SuggestionsPageComponent;
  let fixture: ComponentFixture<SuggestionsPageComponent>;
  let scheduler: TestScheduler;
  const mockSuggestionsService = getMockSuggestionsService();
  const mockSuggestionsTargetStateService = getMockSuggestionNotificationsStateService();
  const router = new RouterStub();
  const routeStub = {
    data: observableOf({
      suggestionTargets: createSuccessfulRemoteDataObject(mockSuggestionTargetsObjectOne),
    }),
    queryParams: observableOf({}),
  };
  const workspaceitemServiceMock = jasmine.createSpyObj('WorkspaceitemDataService', {
    importExternalSourceEntry: jasmine.createSpy('importExternalSourceEntry'),
  });

  const authService = jasmine.createSpyObj('authService', {
    isAuthenticated: observableOf(true),
    setRedirectUrl: {},
  });
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        TranslateModule.forRoot(),
        SuggestionEvidencesComponent,
        SuggestionListElementComponent,
        SuggestionsPageComponent,
        ObjectKeysPipe,
        VarDirective,
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
        SuggestionsPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsPageComponent);
    component = fixture.componentInstance;
    scheduler = getTestScheduler();
  });

  it('should create', () => {
    spyOn(component, 'updatePage').and.callThrough();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    expect(component).toBeTruthy();
    expect(component.suggestionId).toBe(mockSuggestionTargetsObjectOne.id);
    expect(component.researcherName).toBe(mockSuggestionTargetsObjectOne.display);
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should update page on pagination change', () => {
    spyOn(component, 'updatePage').and.callThrough();
    component.targetId$ = observableOf('testid');

    scheduler.schedule(() => component.onPaginationChange());
    scheduler.flush();

    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should update suggestion on page update', () => {
    spyOn(component.processing$, 'next');
    spyOn(component.suggestionsRD$, 'next');

    component.targetId$ = observableOf('testid');
    scheduler.schedule(() => component.updatePage().subscribe());
    scheduler.flush();

    expect(component.processing$.next).toHaveBeenCalledTimes(2);
    expect(mockSuggestionsService.getSuggestions).toHaveBeenCalled();
    expect(component.suggestionsRD$.next).toHaveBeenCalled();
    expect(mockSuggestionsService.clearSuggestionRequests).toHaveBeenCalled();
  });

  it('should flag suggestion for deletion', fakeAsync(() => {
    spyOn(component, 'updatePage').and.callThrough();
    component.targetId$ = observableOf('testid');

    scheduler.schedule(() => component.ignoreSuggestion('1'));
    scheduler.flush();

    expect(mockSuggestionsService.ignoreSuggestion).toHaveBeenCalledWith('1');
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  }));

  it('should flag all suggestion for deletion', () => {
    spyOn(component, 'updatePage').and.callThrough();
    component.targetId$ = observableOf('testid');

    scheduler.schedule(() => component.ignoreSuggestionAllSelected());
    scheduler.flush();

    expect(mockSuggestionsService.ignoreSuggestionMultiple).toHaveBeenCalled();
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should approve and import', () => {
    spyOn(component, 'updatePage').and.callThrough();
    component.targetId$ = observableOf('testid');

    scheduler.schedule(() => component.approveAndImport({ collectionId: '1234' } as unknown as SuggestionApproveAndImport));
    scheduler.flush();

    expect(mockSuggestionsService.approveAndImport).toHaveBeenCalled();
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should approve and import multiple suggestions', () => {
    spyOn(component, 'updatePage').and.callThrough();
    component.targetId$ = observableOf('testid');

    scheduler.schedule(() => component.approveAndImportAllSelected({ collectionId: '1234' } as unknown as SuggestionApproveAndImport));
    scheduler.flush();

    expect(mockSuggestionsService.approveAndImportMultiple).toHaveBeenCalled();
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should select and deselect suggestion', () => {
    component.selectedSuggestions = {};
    component.onSelected(mockSuggestionPublicationOne, true);
    expect(component.selectedSuggestions[mockSuggestionPublicationOne.id]).toBe(mockSuggestionPublicationOne);
    component.onSelected(mockSuggestionPublicationOne, false);
    expect(component.selectedSuggestions[mockSuggestionPublicationOne.id]).toBeUndefined();
  });

  it('should toggle all suggestions', () => {
    component.selectedSuggestions = {};
    component.onToggleSelectAll([mockSuggestionPublicationOne, mockSuggestionPublicationTwo]);
    expect(component.selectedSuggestions[mockSuggestionPublicationOne.id]).toEqual(mockSuggestionPublicationOne);
    expect(component.selectedSuggestions[mockSuggestionPublicationTwo.id]).toEqual(mockSuggestionPublicationTwo);
    component.onToggleSelectAll([mockSuggestionPublicationOne, mockSuggestionPublicationTwo]);
    expect(component.selectedSuggestions).toEqual({});
  });

  it('should return all selected suggestions count', () => {
    component.selectedSuggestions = {};
    component.onToggleSelectAll([mockSuggestionPublicationOne, mockSuggestionPublicationTwo]);
    expect(component.getSelectedSuggestionsCount()).toEqual(2);
  });

  it('should check if all collection is fixed', () => {
    component.isCollectionFixed([mockSuggestionPublicationOne, mockSuggestionPublicationTwo]);
    expect(mockSuggestionsService.isCollectionFixed).toHaveBeenCalled();
  });

  it('should translate suggestion source', () => {
    component.translateSuggestionSource();
    expect(mockSuggestionsService.translateSuggestionSource).toHaveBeenCalled();
  });

  it('should translate suggestion type', () => {
    component.translateSuggestionType();
    expect(mockSuggestionsService.translateSuggestionType).toHaveBeenCalled();
  });
});

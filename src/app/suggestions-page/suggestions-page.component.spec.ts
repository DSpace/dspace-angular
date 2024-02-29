import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { SuggestionsPageComponent } from './suggestions-page.component';

import { getMockSuggestionNotificationsStateService, getMockSuggestionsService } from '../shared/mocks/suggestion.mock';
import { mockSuggestionPublicationOne, mockSuggestionPublicationTwo } from '../shared/mocks/publication-claim.mock';
import { ObjectKeysPipe } from '../shared/utils/object-keys-pipe';
import { VarDirective } from '../shared/utils/var.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../shared/testing/router.stub';
import { mockSuggestionTargetsObjectOne } from '../shared/mocks/publication-claim-targets.mock';
import { AuthService } from '../core/auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { getMockTranslateService } from '../shared/mocks/translate.service.mock';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { PaginationServiceStub } from '../shared/testing/pagination-service.stub';
import { PaginationService } from '../core/pagination/pagination.service';
import {
  SuggestionEvidencesComponent
} from '../notifications/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import {
  SuggestionApproveAndImport,
  SuggestionListElementComponent
} from '../notifications/suggestion-list-element/suggestion-list-element.component';
import { SuggestionsService } from '../notifications/suggestions.service';
import { SuggestionTargetsStateService } from '../notifications/suggestion-targets/suggestion-targets.state.service';

describe('SuggestionPageComponent', () => {
  let component: SuggestionsPageComponent;
  let fixture: ComponentFixture<SuggestionsPageComponent>;
  let scheduler: TestScheduler;
  const mockSuggestionsService = getMockSuggestionsService();
  const mockSuggestionsTargetStateService = getMockSuggestionNotificationsStateService();
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

  it('should update page on pagination change', () => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    component.onPaginationChange();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should update suggestion on page update', (done) => {
    spyOn(component.processing$, 'next');
    spyOn(component.suggestionsRD$, 'next');

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    paginationService.getFindListOptions().subscribe(() => {
      expect(component.processing$.next).toHaveBeenCalled();
      expect(mockSuggestionsService.getSuggestions).toHaveBeenCalled();
      expect(component.suggestionsRD$.next).toHaveBeenCalled();
      expect(mockSuggestionsService.clearSuggestionRequests).toHaveBeenCalled();
      done();
    });
    component.updatePage();
  });

  it('should flag suggestion for deletion', fakeAsync(() => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    component.ignoreSuggestion('1');
    expect(mockSuggestionsService.ignoreSuggestion).toHaveBeenCalledWith('1');
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    tick(201);
    expect(component.updatePage).toHaveBeenCalled();
  }));

  it('should flag all suggestion for deletion', () => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    component.ignoreSuggestionAllSelected();
    expect(mockSuggestionsService.ignoreSuggestionMultiple).toHaveBeenCalled();
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should approve and import', () => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    component.approveAndImport({collectionId: '1234'} as unknown as SuggestionApproveAndImport);
    expect(mockSuggestionsService.approveAndImport).toHaveBeenCalled();
    expect(mockSuggestionsTargetStateService.dispatchRefreshUserSuggestionsAction).toHaveBeenCalled();
    expect(component.updatePage).toHaveBeenCalled();
  });

  it('should approve and import multiple suggestions', () => {
    spyOn(component, 'updatePage').and.stub();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    component.approveAndImportAllSelected({collectionId: '1234'} as unknown as SuggestionApproveAndImport);
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

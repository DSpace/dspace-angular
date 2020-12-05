import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SuggestionListElementComponent } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { getMockSuggestionsService } from '../shared/mocks/openaire.mock';
import { PaginatedList } from '../core/data/paginated-list';
import { OpenaireSuggestion } from '../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { createPaginatedList } from '../shared/testing/utils.test';
import { mockSuggestionPublicationOne, mockSuggestionPublicationTwo } from '../shared/mocks/reciter-suggestion.mock';
import { SuggestionEvidencesComponent } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { ObjectKeysPipe } from '../shared/utils/object-keys-pipe';
import { VarDirective } from '../shared/utils/var.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../shared/testing/router.stub';
import { RemoteData } from '../core/data/remote-data';
import { mockSuggestionTargetsObjectOne } from '../shared/mocks/reciter-suggestion-targets.mock';
import { ItemDataService } from '../core/data/item-data.service';
import { AuthService } from '../core/auth/auth.service';

describe('SuggestionPageComponent', () => {
  let component: SuggestionsPageComponent;
  let fixture: ComponentFixture<SuggestionsPageComponent>;
  const mockSuggestionsService = getMockSuggestionsService();
  const suggestionTargetsList: PaginatedList<OpenaireSuggestion> = createPaginatedList([mockSuggestionPublicationOne, mockSuggestionPublicationTwo])
  const router = new RouterStub();
  const routeStub = {
    data: observableOf({
      suggestionTargets: new RemoteData(false, false, true, null, mockSuggestionTargetsObjectOne)
    })
  };
  const itemServiceMock = jasmine.createSpyObj('ItemDataService', {
    importExternalSourceEntry: jasmine.createSpy('importExternalSourceEntry')
  });

  const authService = jasmine.createSpyObj('authService', {
    isAuthenticated: observableOf(true),
    setRedirectUrl: {}
  });

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
        { provide: ItemDataService, useValue: itemServiceMock },
        { provide: Router, useValue: router },
        { provide: SuggestionsService, useValue: mockSuggestionsService },
        SuggestionsPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrectionSuggestionComponent } from './correction-suggestion.component';
import { ActivatedRoute } from '@angular/router';
import { CorrectionTypeDataService } from 'src/app/core/submission/correctiontype-data.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CorrectionSuggestionComponent', () => {
  let component: CorrectionSuggestionComponent;
  let fixture: ComponentFixture<CorrectionSuggestionComponent>;

  const correctionTypeMock = {
    id: 'addpersonalpath',
    topic: '/DSPACEUSERS/RELATIONADD/PERSONALPATH',
    discoveryConfiguration: 'RELATION.PersonPath.Items',
    creationForm: 'manageRelation',
    type: 'correctiontype',
    _links: {
      self: {
        href: 'https://rest.api/discover/configurations/addpersonalpath',
      },
    },
  };

  const correctionTypeMockRD$ = createSuccessfulRemoteDataObject$(correctionTypeMock);

  const mockActivatedRoute = {
    snapshot:{
      params: {
        correctionType: 'addpersonalpath'
      }
    }
  };

  let correctionTypeDataService: any;

  beforeEach(async () => {
    correctionTypeDataService = jasmine.createSpyObj('correctionTypeDataService', {
      getCorrectionTypeById: jasmine.createSpy('getCorrectionTypeById')
    });

    await TestBed.configureTestingModule({
      declarations: [ CorrectionSuggestionComponent ],
      imports: [
        CommonModule,
        BrowserModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CorrectionTypeDataService, useValue: correctionTypeDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionSuggestionComponent);
    component = fixture.componentInstance;
    correctionTypeDataService.getCorrectionTypeById.and.returnValue(correctionTypeMockRD$);
    spyOn(component, 'initComponent');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to route params and set correctionTypeId & initialize component', () => {
    expect((component as any).correctionTypeId).toEqual('addpersonalpath');
    expect(component.initComponent).toHaveBeenCalled();
  });
});

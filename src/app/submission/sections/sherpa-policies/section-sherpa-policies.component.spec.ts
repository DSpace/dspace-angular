import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionServiceStub } from './../../../shared/testing/submission-service.stub';
import { dataRes, getSherpaPoliciesData } from './../../../shared/mocks/section-sherpa-policies.service.mock';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { BrowserModule, By } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { SectionSherpaPoliciesService } from './section-sherpa-policies.service';
import { SubmissionSectionSherpaPoliciesComponent } from './section-sherpa-policies.component';
import { SubmissionService } from '../../submission.service';
import { DebugElement } from '@angular/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

describe('SubmissionSectionSherpaPoliciesComponent', () => {
  let component: SubmissionSectionSherpaPoliciesComponent;
  let fixture: ComponentFixture<SubmissionSectionSherpaPoliciesComponent>;
  let de: DebugElement;

  const sectionsServiceStub = new SectionsServiceStub();
  // const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionId, 'files', fileIndex);

  const builderService: FormBuilderService = getMockFormBuilderService();
  const sectionSherpaPoliciesService = getSherpaPoliciesData();

  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
    replace: undefined,
  });

  const storeStub = jasmine.createSpyObj('store', ['dispatch']);

  const sectionData = {
    header: 'submit.progressbar.sherpaPolicies',
    config: 'http://localhost:8080/server/api/config/submissionaccessoptions/SherpaPoliciesDefaultConfiguration',
    mandatory: true,
    sectionType: 'sherpaPolicies',
    collapsed: false,
    enabled: true,
    data: dataRes,
    errorsToShow: [],
    serverValidationErrors: [],
    isLoading: false,
    isValid: true
  };

  describe('SubmissionSectionSherpaPoliciesComponent', () => {

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
          NgbAccordionModule
        ],
        declarations: [SubmissionSectionSherpaPoliciesComponent],
        providers: [
          { provide: SectionsService, useValue: sectionsServiceStub },
          { provide: SectionSherpaPoliciesService, useValue: sectionSherpaPoliciesService },
          { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
          { provide: SubmissionService, useValue: SubmissionServiceStub },
          { provide: Store, useValue: storeStub },
          { provide: 'sectionDataProvider', useValue: sectionData },
          { provide: 'submissionIdProvider', useValue: '1508' },
        ]
      })
        .compileComponents();
    });

    beforeEach(inject([Store], (store: Store<AppState>) => {
      fixture = TestBed.createComponent(SubmissionSectionSherpaPoliciesComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      fixture.detectChanges();
    }));


    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show accordions', () => {
      expect(de.query(By.css('ngb-accordion'))).toBeTruthy();
    });

    it('should show expanded accordion', () => {
      expect(component.acc.first.isExpanded('publication-information-0')).toBeTrue();
    });

    it('should show refresh button', () => {
      expect(de.query(By.css('.refresh-container > button'))).toBeTruthy();
    });

    it('should show publisher information', () => {
      expect(de.query(By.css('ds-publication-information'))).toBeTruthy();
    });

    it('should show publisher policy', () => {
      expect(de.query(By.css('ds-publisher-policy'))).toBeTruthy();
    });

    it('should show metadata information', () => {
      expect(de.query(By.css('ds-metadata-information'))).toBeTruthy();
    });

    it('when refresh button click operationsBuilder.remove should have been called', () => {
      de.query(By.css('.refresh-container > button')).nativeElement.click();
      fixture.detectChanges();
      expect(operationsBuilder.remove).toHaveBeenCalled();
    });


  });

});

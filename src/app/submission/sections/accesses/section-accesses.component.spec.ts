import { FormService } from '../../../shared/form/form.service';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { SubmissionSectionAccessesComponent } from './section-accesses.component';
import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { SubmissionAccessesConfigDataService } from '../../../core/config/submission-accesses-config-data.service';
import {
  accessConditionSectionConfigRes,
  accessConditionSectionSingleAccessConfigRes,
  getSubmissionAccessesConfigNotChangeDiscoverableService,
  getSubmissionAccessesConfigService
} from '../../../shared/mocks/section-accesses-config.service.mock';
import { SectionAccessesService } from './section-accesses.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  SubmissionJsonPatchOperationsService
} from '../../../core/submission/submission-json-patch-operations.service';
import { getSectionAccessesService } from '../../../shared/mocks/section-accesses.service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import {
  SubmissionJsonPatchOperationsServiceStub
} from '../../../shared/testing/submission-json-patch-operations-service.stub';
import { BrowserModule } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormComponent } from '../../../shared/form/form.component';
import {
  DynamicCheckboxModel,
  DynamicDatePickerModel,
  DynamicFormArrayModel,
  DynamicFormGroupModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';
import { AppState } from '../../../app.reducer';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { mockAccessesFormData, mockAccessesServiceData } from '../../../shared/mocks/submission.mock';
import { accessConditionChangeEvent, checkboxChangeEvent } from '../../../shared/testing/form-event.stub';
import { XSRFService } from '../../../core/xsrf/xsrf.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';

describe('SubmissionSectionAccessesComponent', () => {
  let component: SubmissionSectionAccessesComponent;
  let fixture: ComponentFixture<SubmissionSectionAccessesComponent>;

  const sectionsServiceStub = new SectionsServiceStub();
  const builderService: FormBuilderService = getMockFormBuilderService();
  const submissionAccessesConfigService: jasmine.SpyObj<SubmissionAccessesConfigDataService> = getSubmissionAccessesConfigService();
  const sectionAccessesService = getSectionAccessesService();
  const sectionFormOperationsService = getMockFormOperationsService();
  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
    replace: undefined,
  });

  let formService: any;
  let formbuilderService: any;

  const storeStub = jasmine.createSpyObj('store', ['dispatch']);

  const sectionData = {
    header: 'submit.progressbar.accessCondition',
    config: 'http://localhost:8080/server/api/config/submissionaccessoptions/AccessConditionDefaultConfiguration',
    mandatory: true,
    sectionType: 'accessCondition',
    collapsed: false,
    enabled: true,
    data: {
      discoverable: true,
      accessConditions: []
    },
    errorsToShow: [],
    serverValidationErrors: [],
    isLoading: false,
    isValid: true
  };

  describe('First with canChangeDiscoverable true', () => {

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          TranslateModule.forRoot()
        ],
        declarations: [SubmissionSectionAccessesComponent, FormComponent],
        providers: [
          { provide: SectionsService, useValue: sectionsServiceStub },
          { provide: SubmissionAccessesConfigDataService, useValue: submissionAccessesConfigService },
          { provide: SectionAccessesService, useValue: sectionAccessesService },
          { provide: SectionFormOperationsService, useValue: sectionFormOperationsService },
          { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
          { provide: TranslateService, useValue: getMockTranslateService() },
          { provide: FormService, useValue: getMockFormService() },
          { provide: Store, useValue: storeStub },
          { provide: XSRFService, useValue: {} },
          { provide: SubmissionJsonPatchOperationsService, useValue: SubmissionJsonPatchOperationsServiceStub },
          { provide: 'sectionDataProvider', useValue: sectionData },
          { provide: 'submissionIdProvider', useValue: '1508' },
          FormBuilderService
        ]
      })
        .compileComponents();
    });

    describe('when singleAccessCondition is false', () => {
      beforeEach(inject([Store], (store: Store<AppState>) => {
        fixture = TestBed.createComponent(SubmissionSectionAccessesComponent);
        component = fixture.componentInstance;
        formService = TestBed.inject(FormService);
      formbuilderService = TestBed.inject(FormBuilderService);
        formService.validateAllFormFields.and.callFake(() => null);
        formService.isValid.and.returnValue(observableOf(true));
        formService.getFormData.and.returnValue(observableOf(mockAccessesFormData));
        sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(null));
        submissionAccessesConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(accessConditionSectionConfigRes) as any);
        fixture.detectChanges();
      }));


      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should have created formModel', () => {
        expect(component.formModel).toBeTruthy();
      });

      it('should have formModel length should be 2', () => {
        expect(component.formModel.length).toEqual(2);
      });

      it('formModel should have 1 model type checkbox and 1 model type array', () => {
        expect(component.formModel[0] instanceof DynamicCheckboxModel).toBeTrue();
        expect(component.formModel[1] instanceof DynamicFormArrayModel).toBeTrue();
      });

      it('formModel type array should have formgroup with 1 input and 2 datepickers', () => {
        const formModel: any = component.formModel[1];
        const formGroup = formModel.groupFactory()[0].group;

        expect(formGroup[0] instanceof DynamicSelectModel).toBeTrue();
        expect(formGroup[1] instanceof DynamicDatePickerModel).toBeTrue();
        expect(formGroup[2] instanceof DynamicDatePickerModel).toBeTrue();
      });

    it('should have set maxStartDate and maxEndDate properly', () => {
      const maxStartDate = {year: 2024, month: 12, day: 20};
      const maxEndDate = {year: 2022, month: 6, day: 20};

      const startDateModel = formbuilderService.findById('startDate', component.formModel);
      expect(startDateModel.max).toEqual(maxStartDate);
      const endDateModel = formbuilderService.findById('endDate', component.formModel);
      expect(endDateModel.max).toEqual(maxEndDate);
    });

      it('when checkbox changed it should call operationsBuilder replace function', () => {
        component.onChange(checkboxChangeEvent);
        fixture.detectChanges();

        expect(operationsBuilder.replace).toHaveBeenCalled();
      });

      it('when dropdown select changed it should call operationsBuilder add function', () => {
        component.onChange(accessConditionChangeEvent);
        fixture.detectChanges();
        expect(operationsBuilder.add).toHaveBeenCalled();
      });
    });

    describe('when singleAccessCondition is true', () => {
      beforeEach(inject([Store], (store: Store<AppState>) => {
        fixture = TestBed.createComponent(SubmissionSectionAccessesComponent);
        component = fixture.componentInstance;
        formService = TestBed.inject(FormService);
        formService.validateAllFormFields.and.callFake(() => null);
        formService.isValid.and.returnValue(observableOf(true));
        formService.getFormData.and.returnValue(observableOf(mockAccessesFormData));
        sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(null));
        submissionAccessesConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(accessConditionSectionSingleAccessConfigRes) as any);
        fixture.detectChanges();
      }));

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should have created formModel', () => {
        expect(component.formModel).toBeTruthy();
      });

      it('should have formModel length should be 2', () => {
        expect(component.formModel.length).toEqual(2);
      });

      it('formModel should have 1 model type checkbox and 1 model type group', () => {
        expect(component.formModel[0] instanceof DynamicCheckboxModel).toBeTrue();
        expect(component.formModel[1] instanceof DynamicFormGroupModel).toBeTrue();
      });

      it('formModel type array should have formgroup with 1 input and 2 datepickers', () => {
        const formModel: any = component.formModel[1];
        const formGroup = formModel.group;
        expect(formGroup[0] instanceof DynamicSelectModel).toBeTrue();
        expect(formGroup[1] instanceof DynamicDatePickerModel).toBeTrue();
        expect(formGroup[2] instanceof DynamicDatePickerModel).toBeTrue();
      });

      it('when checkbox changed it should call operationsBuilder replace function', () => {
        component.onChange(checkboxChangeEvent);
        fixture.detectChanges();

        expect(operationsBuilder.replace).toHaveBeenCalled();
      });

      it('when dropdown select changed it should call operationsBuilder add function', () => {
        component.onChange(accessConditionChangeEvent);
        fixture.detectChanges();
        expect(operationsBuilder.add).toHaveBeenCalled();
      });
    });
  });

  describe('when canDescoverable is false', () => {



    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          TranslateModule.forRoot()
        ],
        declarations: [SubmissionSectionAccessesComponent, FormComponent],
        providers: [
          { provide: SectionsService, useValue: sectionsServiceStub },
          { provide: FormBuilderService, useValue: builderService },
          { provide: SubmissionAccessesConfigDataService, useValue: getSubmissionAccessesConfigNotChangeDiscoverableService() },
          { provide: SectionAccessesService, useValue: sectionAccessesService },
          { provide: SectionFormOperationsService, useValue: sectionFormOperationsService },
          { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
          { provide: TranslateService, useValue: getMockTranslateService() },
          { provide: FormService, useValue: getMockFormService() },
          { provide: Store, useValue: storeStub },
          { provide: XSRFService, useValue: {} },
          { provide: SubmissionJsonPatchOperationsService, useValue: SubmissionJsonPatchOperationsServiceStub },
          { provide: 'sectionDataProvider', useValue: sectionData },
          { provide: 'submissionIdProvider', useValue: '1508' },
        ]
      })
        .compileComponents();
    });

    beforeEach(inject([Store], (store: Store<AppState>) => {
      fixture = TestBed.createComponent(SubmissionSectionAccessesComponent);
      component = fixture.componentInstance;
      formService = TestBed.inject(FormService);
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(observableOf(true));
      formService.getFormData.and.returnValue(observableOf(mockAccessesFormData));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(null));
      fixture.detectChanges();
    }));


    it('should have formModel length should be 1', () => {
      expect(component.formModel.length).toEqual(1);
    });

    it('formModel should have only 1 model type array', () => {
      expect(component.formModel[0] instanceof DynamicFormArrayModel).toBeTrue();
    });

  });

  describe('when section is required', () => {

    const service = getSectionAccessesService();

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          TranslateModule.forRoot()
        ],
        declarations: [SubmissionSectionAccessesComponent, FormComponent],
        providers: [
          { provide: SectionsService, useValue: sectionsServiceStub },
          { provide: SubmissionAccessesConfigDataService, useValue: submissionAccessesConfigService },
          { provide: SectionAccessesService, useValue: service },
          { provide: SectionFormOperationsService, useValue: sectionFormOperationsService },
          { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
          { provide: TranslateService, useValue: getMockTranslateService() },
          { provide: FormService, useValue: getMockFormService() },
          { provide: Store, useValue: storeStub },
          { provide: XSRFService, useValue: {} },
          { provide: SubmissionJsonPatchOperationsService, useValue: SubmissionJsonPatchOperationsServiceStub },
          { provide: 'sectionDataProvider', useValue: sectionData },
          { provide: 'submissionIdProvider', useValue: '1508' },
          FormBuilderService
        ]
      })
        .compileComponents();
    });

    beforeEach(inject([Store], (store: Store<AppState>) => {
      fixture = TestBed.createComponent(SubmissionSectionAccessesComponent);
      component = fixture.componentInstance;
      formService = TestBed.inject(FormService);
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(observableOf(true));
      formService.getFormData.and.returnValue(observableOf(mockAccessesFormData));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(null));
      submissionAccessesConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(accessConditionSectionConfigRes) as any);
      fixture.detectChanges();
    }));

    it('should have section status invalid on init', (done) => {
      component.required$.next(true);
      service.getAccessesData.and.returnValue(observableOf({}));
      fixture.detectChanges();

      component.getSectionStatus().subscribe(status => {
        expect(status).toEqual(false);
        done();
      });
    });

    it('should have section status valid if there are data and no error', (done) => {
      service.getAccessesData.and.returnValue(observableOf(mockAccessesServiceData));
      component.required$.next(true);
      fixture.detectChanges();

      component.getSectionStatus().subscribe(status => {
        expect(status).toEqual(true);
        done();
      });
    });

    it('should have section status invalid if there are data and errors', (done) => {
      service.getAccessesData.and.returnValue(observableOf(mockAccessesServiceData));
      component.required$.next(true);
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf({error: 'testError'}));

      fixture.detectChanges();

      component.getSectionStatus().subscribe(status => {
        expect(status).toEqual(false);
        done();
      });
    });
  });
});

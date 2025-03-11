import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  DynamicFormControlEvent,
  DynamicInputModel,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of as observableOf } from 'rxjs';

import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { WorkspaceitemSectionCustomUrlObject } from '../../../core/submission/models/workspaceitem-section-custom-url.model';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormService } from '../../../shared/form/form.service';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { SubmissionSectionCustomUrlComponent } from './submission-section-custom-url.component';
import SpyObj = jasmine.SpyObj;
import { FormComponent } from '../../../shared/form/form.component';

describe('SubmissionSectionCustomUrlComponent', () => {

  let component: SubmissionSectionCustomUrlComponent;
  let fixture: ComponentFixture<SubmissionSectionCustomUrlComponent>;
  let de: DebugElement;

  const builderService: SpyObj<FormBuilderService> = getMockFormBuilderService() as SpyObj<FormBuilderService>;
  const sectionFormOperationsService: SpyObj<SectionFormOperationsService> = getMockFormOperationsService() as SpyObj<SectionFormOperationsService>;
  const customUrlData = {
    'url': 'test',
    'redirected-urls': [
      'redirected1',
      'redirected2',
    ],
  } as WorkspaceitemSectionCustomUrlObject;

  let formService: any;

  const sectionService = jasmine.createSpyObj('sectionService', {
    getSectionState: observableOf({ data: customUrlData }),
    setSectionStatus: () => undefined,
    updateSectionData: (submissionId, sectionId, updatedData) => {
      component.sectionData.data = updatedData;
    },
    getSectionServerErrors: observableOf([]),
    checkSectionErrors: () => undefined,
  });

  const sectionObject: SectionDataObject = {
    config: 'test config',
    mandatory: true,
    opened: true,
    data: {},
    errorsToShow: [],
    serverValidationErrors: [],
    header: 'test header',
    id: 'test section id',
    sectionType: SectionsType.CustomUrl,
    sectionVisibility: null,
  };

  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
    replace: undefined,
  });

  const submissionService = jasmine.createSpyObj('SubmissionService', {
    getSubmissionScope: jasmine.createSpy('getSubmissionScope'),
  });

  const changeEvent: DynamicFormControlEvent = {
    $event: {

      type: 'change',
    },
    context: null,
    control: new FormControl({
      errors: null,
      pristine: false,
      status: 'VALID',
      touched: true,
      value: 'test-url',
      _updateOn: 'change',
    }),
    group: new FormGroup({}),
    model: new DynamicInputModel({
      additional: null,
      asyncValidators: null,
      controlTooltip: null,
      errorMessages: null,
      hidden: false,
      hint: null,
      id: 'url',
      label: 'Url',
      labelTooltip: null,
      name: 'url',
      relations: [],
      required: false,
      tabIndex: null,
      updateOn: null,
    }),
    type: 'change',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SubmissionSectionCustomUrlComponent,
        MockComponent(FormComponent),
      ],
      providers: [
        { provide: SectionsService, useValue: sectionService },
        { provide: SubmissionService, useValue: submissionService },
        { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
        { provide: FormBuilderService, useValue: builderService },
        { provide: SectionFormOperationsService, useValue: sectionFormOperationsService },
        { provide: FormService, useValue: getMockFormService() },
        { provide: 'entityType', useValue: 'Person' },
        { provide: 'collectionIdProvider', useValue: 'test collection id' },
        { provide: 'sectionDataProvider', useValue: Object.assign({}, sectionObject) },
        { provide: 'submissionIdProvider', useValue: 'test submission id' },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSectionCustomUrlComponent);
    component = fixture.componentInstance;

    formService = TestBed.inject(FormService);
    formService.validateAllFormFields.and.callFake(() => null);
    formService.isValid.and.returnValue(observableOf(true));
    formService.getFormData.and.returnValue(observableOf({}));

    de = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    sectionFormOperationsService.getFieldValueFromChangeEvent.calls.reset();
    operationsBuilder.replace.calls.reset();
    operationsBuilder.add.calls.reset();
  });

  it('should display custom url section', () => {
    expect(de.query(By.css('.custom-url'))).toBeTruthy();
  });

  it('should have the right url formed', () => {
    expect(component.frontendUrl).toContain('/entities/person');
  });

  it('formModel should have length of 1', () => {
    expect(component.formModel.length).toEqual(1);
  });

  it('formModel should have 1 DynamicInputModel', () => {
    expect(component.formModel[0] instanceof DynamicInputModel).toBeTrue();
  });

  it('if edit item true should show redirected urls managment', () => {
    expect(de.query(By.css('.previous-urls'))).toBeFalsy();
  });

  it('if edit item true should show redirected urls managment', () => {
    component.isEditItemScope = true;
    fixture.detectChanges();
    expect(de.query(By.css('.previous-urls'))).toBeTruthy();
  });

  it('when input changed it should call operationsBuilder replace', () => {
    component.onChange(changeEvent);
    fixture.detectChanges();

    expect(operationsBuilder.replace).toHaveBeenCalled();
  });

  it('when input changed and is not empty it should call operationsBuilder add function for redirected urls', () => {
    component.isEditItemScope = true;
    component.customSectionData.url = 'url';
    sectionFormOperationsService.getFieldValueFromChangeEvent.and.returnValue(new FormFieldMetadataValueObject('testurl'));
    component.onChange(changeEvent);
    fixture.detectChanges();

    expect(operationsBuilder.add).toHaveBeenCalled();
  });

  it('when input changed and is empty it should not call operationsBuilder add function for redirected urls', () => {
    component.isEditItemScope = true;
    component.customSectionData.url = 'url';
    sectionFormOperationsService.getFieldValueFromChangeEvent.and.returnValue(new FormFieldMetadataValueObject(''));
    component.onChange(changeEvent);
    fixture.detectChanges();

    expect(operationsBuilder.add).not.toHaveBeenCalled();
  });


  it('when remove button clicked it should call operationsBuilder remove function for redirected urls', () => {
    component.remove(1);
    fixture.detectChanges();
    expect(operationsBuilder.remove).toHaveBeenCalled();
  });

});

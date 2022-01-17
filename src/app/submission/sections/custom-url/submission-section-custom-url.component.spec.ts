import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubmissionSectionCustomUrlComponent } from './submission-section-custom-url.component';
import { of as observableOf } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../../shared/shared.module';
import { SectionsService } from '../sections.service';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SubmissionService } from '../../submission.service';
import { WorkspaceitemSectionCustomUrlObject } from '../../../core/submission/models/workspaceitem-section-custom-url.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import { DynamicFormArrayModel, DynamicInputModel, DynamicSelectModel, DynamicFormControlEvent } from '@ng-dynamic-forms/core';
import { tap } from 'rxjs/operators';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { FormService } from '../../../shared/form/form.service';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { DsDynamicTypeBindRelationService } from '../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-type-bind-relation.service';
import { RelationshipService } from '../../../core/data/relationship.service';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { StoreModule } from '@ngrx/store';
import { formReducer } from '../../../shared/form/form.reducer';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormControl, FormGroup } from '@angular/forms';



describe('SubmissionSectionCustomUrlComponent', () => {

  let component: SubmissionSectionCustomUrlComponent;
  let fixture: ComponentFixture<SubmissionSectionCustomUrlComponent>;
  let de: DebugElement;

  const builderService: FormBuilderService = getMockFormBuilderService();
  const sectionFormOperationsService = getMockFormOperationsService();
  const customUrlData = {
    'url': 'test',
    'redirected-urls': [
      'redirected1',
      'redirected2'
    ]
  } as WorkspaceitemSectionCustomUrlObject;

  let formService: any;

  const sectionService = jasmine.createSpyObj('sectionService', {
    getSectionState: observableOf({ data: customUrlData }),
    setSectionStatus: () => undefined,
    updateSectionData: (submissionId, sectionId, updatedData) => {
      component.sectionData.data = updatedData;
    }
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
    sectionVisibility: null
  };

  const operationsBuilder = jasmine.createSpyObj('operationsBuilder', {
    add: undefined,
    remove: undefined,
    replace: undefined
  });


  const submissionService = jasmine.createSpyObj('SubmissionService', {
    getSubmissionScope: jasmine.createSpy('getSubmissionScope')
  });

  const changeEvent: DynamicFormControlEvent = {
    $event: {
      bubbles: true,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      path: ['input#accessCondition-0-endDate.form-control.ng-touched.ng-dirty.ng-valid', 'div.input-group.ng-touched.ng-valid.ng-pristine', 'ds-dynamic-date-picker-inline.ng-star-inserted, div, div, div, div.ng-touched.ng-valid.ng-pristine, ds-dynamic-form-control-container.col-6.ng-star-inserted, div#accessCondition-0-accessConditionGroup.form-row.ng-star-inserted.ng-touched.ng-valid.ng-pristine, ds-dynamic-form-group.ng-star-inserted, div, div, div, div.pl-1.pr-1.ng-touched.ng-valid.ng-pristine, ds-dynamic-form-control-container.form-group.flex-fill.access-condition-group.ng-star-inserted.ng-to…, div.cdk-drag.cdk-drag-handle.form-row.cdk-drag-disabled.ng-star-inserted.ng-touched.ng-valid.ng-pris…, div#cdk-drop-list-5.cdk-drop-list, div#accessCondition.ng-star-inserted.ng-touched.ng-valid.ng-pristine, ds-dynamic-form-array.ng-star-inserted, div, div, div, div.form-group.ng-touched.ng-valid.ng-pristine, ds-dynamic-form-control-container.ng-star-inserted, ds-dynamic-form.ng-touched.ng-valid.ng-pristine, form.form-horizontal.ng-touched.ng-valid.ng-pristine, div.container-fluid, ds-form.ng-star-inserted, ds-section-accesses.ng-star-inserted, div#sectionContent_AccessConditionDefaultConfiguration.ng-star-inserted, div.card-body, div#AccessConditionDefaultConfiguration.collapse.show.ng-star-inserted, div.card.ng-star-inserted, ngb-accordion.accordion, div#section_AccessConditionDefaultConfiguration.section-focus, ds-submission-section-container.ng-star-inserted, div.submission-form-content, div.container-fluid, ds-submission-form, div.submission-submit-container, ds-submission-edit.ng-star-inserted, ds-themed-submission-edit.ng-star-inserted, div.ng-tns-c392-0, main.main-content.ng-tns-c392-0, div.inner-wrapper.ng-tns-c392-0.ng-trigger.ng-trigger-slideSidebarPadding, div.outer-wrapper.ng-tns-c392-0.ng-star-inserted, ds-root.ng-tns-c392-0.ng-star-inserted, ds-themed-root, ds-app, body, html.wf-droidsans-n4-active.wf-active, document, Window'],
      returnValue: true,
      srcElement: 'input#accessCondition-0-endDate.form-control.ng-touched.ng-dirty.ng-valid',
      target: 'input#accessCondition-0-endDate.form-control.ng-touched.ng-dirty.ng-valid',
      timeStamp: 143042.8999999999,
      type: 'change',
    },
    context: null,
    control: new FormControl({
      errors: null,
      pristine: false,
      status: 'VALID',
      statusChanges: { _isScalar: false, observers: [], closed: false, isStopped: false, hasError: false },
      touched: true,
      value: 'test-url',
      valueChanges: { _isScalar: false, observers: [], closed: false, isStopped: false, hasError: false },
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
      validators: { required: null },
    }),
    type: 'change'
  };


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        SubmissionSectionCustomUrlComponent,
        FormComponent
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

  it('when input changed it should call operationsBuilder add function for redirected urls', () => {
    component.isEditItemScope = true;
    component.submissionCustomUrl.url = 'url';
    component.onChange(changeEvent);
    fixture.detectChanges();

    expect(operationsBuilder.add).toHaveBeenCalled();
  });


  it('when remove button clicked it should call operationsBuilder remove function for redirected urls', () => {
    component.remove(1);
    fixture.detectChanges();
    expect(operationsBuilder.remove).toHaveBeenCalled();
  });

});

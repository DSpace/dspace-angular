import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicCheckboxModel,
  DynamicFormControlEvent,
  DynamicFormControlEventType,
} from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { DsDynamicTypeBindRelationService } from 'src/app/shared/form/builder/ds-dynamic-form-ui/ds-dynamic-type-bind-relation.service';
import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment.test';

import { SubmissionFormsConfigDataService } from '../../../core/config/submission-forms-config-data.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { Collection } from '../../../core/shared/collection.model';
import { License } from '../../../core/shared/license.model';
import { SubmissionObjectDataService } from '../../../core/submission/submission-object-data.service';
import { XSRFService } from '../../../core/xsrf/xsrf.service';
import { dsDynamicFormControlMapFn } from '../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-control-map-fn';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import {
  mockLicenseParsedErrors,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionObject,
} from '../../../shared/mocks/submission.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { SubmissionSectionLicenseComponent } from './section-license.component';

function getMockDsDynamicTypeBindRelationService(): DsDynamicTypeBindRelationService {
  return jasmine.createSpyObj('DsDynamicTypeBindRelationService', {
    getRelatedFormModel: jasmine.createSpy('getRelatedFormModel'),
    matchesCondition: jasmine.createSpy('matchesCondition'),
    subscribeRelations: jasmine.createSpy('subscribeRelations'),
  });
}

const collectionId = mockSubmissionCollectionId;
const licenseText = 'License text';
const mockCollection = Object.assign(new Collection(), {
  name: 'Community 1-Collection 1',
  id: collectionId,
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 1-Collection 1',
    }],
  license: createSuccessfulRemoteDataObject$(Object.assign(new License(), { text: licenseText })),
});

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigDataService {
  return jasmine.createSpyObj('FormOperationsService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch'),
  });
}

const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/license',
  mandatory: true,
  data: {
    url: null,
    acceptanceDate: null,
    granted: false,
  },
  errorsToShow: [],
  serverValidationErrors: [],
  header: 'submit.progressbar.describe.license',
  id: 'license',
  sectionType: SectionsType.License,
};

const dynamicFormControlEvent: DynamicFormControlEvent = {
  $event: new Event('change'),
  context: null,
  control: null,
  group: null,
  model: null,
  type: DynamicFormControlEventType.Change,
};

describe('SubmissionSectionLicenseComponent test suite', () => {

  let comp: SubmissionSectionLicenseComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionLicenseComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let formService: any;
  let formOperationsService: any;
  let formBuilderService: any;

  const sectionsServiceStub: any = new SectionsServiceStub();
  const submissionId = mockSubmissionId;

  const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    add: jasmine.createSpy('add'),
    replace: jasmine.createSpy('replace'),
    remove: jasmine.createSpy('remove'),
  });

  const mockCollectionDataService = jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById'),
    findByHref: jasmine.createSpy('findByHref'),
  });
  const initialState: any = {
    core: {
      'cache/object': {},
      'cache/syncbuffer': {},
      'cache/object-updates': {},
      'data/request': {},
      'index': {},
    },
  };
  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FormComponent,
        SubmissionSectionLicenseComponent,
        TestComponent,
      ],
      providers: [
        { provide: CollectionDataService, useValue: mockCollectionDataService },
        { provide: SectionFormOperationsService, useValue: getMockFormOperationsService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionFormsConfigDataService, useValue: getMockSubmissionFormsConfigService() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SectionsService, useValue: sectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: 'collectionIdProvider', useValue: collectionId },
        { provide: 'sectionDataProvider', useValue: Object.assign({}, sectionObject) },
        { provide: 'submissionIdProvider', useValue: submissionId },
        ChangeDetectorRef,
        provideMockStore({ initialState }),
        FormBuilderService,
        { provide: DsDynamicTypeBindRelationService, useValue: getMockDsDynamicTypeBindRelationService() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
        {
          provide: SubmissionObjectDataService,
          useValue: {
            findById: () => of(createSuccessfulRemoteDataObject(mockSubmissionObject)),
          },
        },
        { provide: XSRFService, useValue: {} },
        SubmissionSectionLicenseComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents().then();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      mockCollectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(of(false));
      sectionsServiceStub.getSectionErrors.and.returnValue(of([]));

      const html = `
        <ds-submission-section-license></ds-submission-section-license>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionLicenseComponent', inject([SubmissionSectionLicenseComponent], (app: SubmissionSectionLicenseComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionLicenseComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService as any);
      formService = TestBed.inject(FormService);
      formBuilderService = TestBed.inject(FormBuilderService);
      formOperationsService = TestBed.inject(SectionFormOperationsService);

      compAsAny.pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);

    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    describe('', () => {
      beforeEach(() => {
        mockCollectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
        sectionsServiceStub.getSectionErrors.and.returnValue(of([]));
        sectionsServiceStub.isSectionReadOnly.and.returnValue(of(false));
        spyOn(formBuilderService, 'findById').and.returnValue(new DynamicCheckboxModel({ id: 'granted' }));
      });

      it('should init section properly', () => {
        fixture.detectChanges();
        spyOn(compAsAny, 'getSectionStatus');

        const model = formBuilderService.findById('granted', comp.formModel);

        expect(compAsAny.subs.length).toBe(2);
        expect(comp.formModel).toBeDefined();
        expect(model.value).toBeFalsy();
        expect(comp.licenseText$).toBeObservable(cold('(ab|)', {
          a: '',
          b: licenseText,
        }));
      });

      it('should set checkbox value to true', () => {
        comp.sectionData.data = {
          url: 'url',
          acceptanceDate: Date.now(),
          granted: true,
        } as any;
        fixture.detectChanges();
        const model = formBuilderService.findById('granted', comp.formModel);
        expect(compAsAny.subs.length).toBe(2);
        expect(comp.formModel).toBeDefined();
        expect(model.value).toBeTruthy();
        expect(comp.licenseText$).toBeObservable(cold('(ab|)', {
          a: '',
          b: licenseText,
        }));
      });

      it('should have status true when checkbox is selected', (done) => {
        fixture.detectChanges();

        const model = formBuilderService.findById('granted', comp.formModel);
        (model as DynamicCheckboxModel).value = true;

        compAsAny.getSectionStatus().pipe(take(1)).subscribe((status) => {
          expect(status).toBeTruthy();
          done();
        });
      });

      it('should have status false when checkbox is not selected', () => {
        fixture.detectChanges();
        const model = formBuilderService.findById('granted', comp.formModel);
        compAsAny.getSectionStatus().subscribe((status) => {
          expect(status).toBeFalsy();
        });

        (model as DynamicCheckboxModel).value = false;
      });

    });

    describe('', () => {
      beforeEach(() => {
        mockCollectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
        sectionsServiceStub.getSectionErrors.and.returnValue(of(mockLicenseParsedErrors.license));
        sectionsServiceStub.isSectionReadOnly.and.returnValue(of(false));
      });

      it('should set section errors properly', () => {
        fixture.detectChanges();
        const expectedErrors = mockLicenseParsedErrors.license;

        expect(sectionsServiceStub.checkSectionErrors).toHaveBeenCalled();
        expect(comp.sectionData.errors).toEqual(expectedErrors);

      });

      it('should remove any section\'s errors when checkbox is selected', () => {
        comp.sectionData.data = {
          url: 'url',
          acceptanceDate: Date.now(),
          granted: true,
        } as any;

        fixture.detectChanges();

        expect(sectionsServiceStub.dispatchRemoveSectionErrors).toHaveBeenCalled();

      });
    });

    describe('', () => {
      let event;
      beforeEach(() => {
        event = dynamicFormControlEvent;
        formOperationsService.getFieldPathSegmentedFromChangeEvent.and.returnValue('granted');
      });

      it('should dispatch a json-path add operation when checkbox is selected', () => {

        formOperationsService.getFieldValueFromChangeEvent.and.returnValue(new FormFieldMetadataValueObject(true));

        comp.onChange(event);

        expect(jsonPatchOpBuilder.add).toHaveBeenCalledWith(pathCombiner.getPath('granted'), 'true', false, true);
        expect(sectionsServiceStub.dispatchRemoveSectionErrors).toHaveBeenCalled();
      });

      it('should dispatch a json-path remove operation when checkbox is not selected', () => {

        formOperationsService.getFieldValueFromChangeEvent.and.returnValue(null);

        comp.onChange(event);

        expect(jsonPatchOpBuilder.remove).toHaveBeenCalledWith(pathCombiner.getPath('granted'));
      });
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    FormComponent,
    FormsModule,
    ReactiveFormsModule,
    SubmissionSectionLicenseComponent,
  ],
})
class TestComponent {

}

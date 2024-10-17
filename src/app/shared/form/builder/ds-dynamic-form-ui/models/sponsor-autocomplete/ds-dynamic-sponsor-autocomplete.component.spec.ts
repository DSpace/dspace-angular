import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { MockMetadataValueService } from '../../../../../testing/metadata-value-data-service.mock';
import { VocabularyServiceStub } from '../../../../../testing/vocabulary-service.stub';
import { MockLookupRelationService } from '../../../../../testing/lookup-relation-service.mock';
import {
  DynamicFormLayoutService,
  DynamicFormsCoreModule,
  DynamicFormValidationService,
 } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { NgbModule, } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MetadataValueDataService } from '../../../../../../core/data/metadata-value-data.service';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService
 } from '../../../../../testing/dynamic-form-mock-services';
import { LookupRelationService } from '../../../../../../core/data/lookup-relation.service';
import { createTestComponent } from '../../../../../testing/utils.test';
import { TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from '../../../../../mocks/translate.service.mock';
import { DsDynamicSponsorAutocompleteModel } from './ds-dynamic-sponsor-autocomplete.model';
import { of, of as observableOf } from 'rxjs';
import { DsDynamicSponsorAutocompleteComponent } from './ds-dynamic-sponsor-autocomplete.component';
import { getMockRequestService } from '../../../../../mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../../../../testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../../../../../mocks/remote-data-build.service.mock';
import { RequestService } from '../../../../../../core/data/request.service';
import { HALEndpointService } from '../../../../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../../../../core/cache/builders/remote-data-build.service';
import { ConfigurationDataService } from '../../../../../../core/data/configuration-data.service';

let AUT_TEST_GROUP;
let AUT_TEST_MODEL_CONFIG;

/**
 * The test class for the DsDynamicSponsorAutocompleteComponent.
 */
function init() {
  AUT_TEST_GROUP = new FormGroup({
    autocomplete: new FormControl(),
  });

  AUT_TEST_MODEL_CONFIG = {
    disabled: false,
    id: 'autocomplete',
    label: 'Keywords',
    minChars: 3,
    name: 'autocomplete',
    placeholder: 'Keywords',
    readOnly: false,
    required: false,
    repeatable: false,
    autocompleteCustom: null
  };
}

describe('DsDynamicSponsorAutocompleteComponent test suite', () => {
  let testComp: TestComponent;
  let autComp: DsDynamicSponsorAutocompleteComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let autFixture: ComponentFixture<DsDynamicSponsorAutocompleteComponent>;
  let html;

  beforeEach(waitForAsync(() => {
    const mockMetadataValueService = new MockMetadataValueService();
    const vocabularyServiceStub = new VocabularyServiceStub();
    const mockLookupRelationService = new MockLookupRelationService();
    const mockTranslateService = getMockTranslateService();
    const requestService = getMockRequestService();
    const halService = Object.assign(new HALEndpointServiceStub('url'));
    const rdbService = getMockRemoteDataBuildService();
    const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
      findByPropertyName: of('hdl'),
    });
    init();
    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
      ],
      declarations: [
        DsDynamicSponsorAutocompleteComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicSponsorAutocompleteComponent,
        { provide: MetadataValueDataService, useValue: mockMetadataValueService },
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
        { provide: LookupRelationService, useValue: mockLookupRelationService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: RequestService, useValue: requestService },
        { provide: HALEndpointService, useValue: halService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: ConfigurationDataService, useValue: configurationServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-sponsor-autocomplete [bindId]="bindId"
                      [group]="group"
                      [model]="model"
                      (blur)="onBlur($event)"
                      (change)="onValueChange($event)"
                      (focus)="onFocus($event)"></ds-dynamic-sponsor-autocomplete>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });
    afterEach(() => {
      testFixture.destroy();
    });
    it('should create DsDynamicSponsorAutocompleteComponent',
      inject([DsDynamicSponsorAutocompleteComponent], (app: DsDynamicSponsorAutocompleteComponent) => {

        expect(app).toBeDefined();
      }));

    describe('when vocabularyOptions are set', () => {
      beforeEach(() => {

        autFixture = TestBed.createComponent(DsDynamicSponsorAutocompleteComponent);
        autComp = autFixture.componentInstance; // FormComponent test instance
        autComp.group = AUT_TEST_GROUP;
        autComp.model = new DsDynamicSponsorAutocompleteModel(AUT_TEST_MODEL_CONFIG);
        autFixture.detectChanges();
      });

      afterEach(() => {
        autFixture.destroy();
        autComp = null;
      });

      it('should init component properly', () => {
        expect(autComp.model.value).toEqual([]);
      });

      it('should search eu when 3+ characters is typed', fakeAsync(() => {
        spyOn((autComp as any).metadataValueService, 'findByMetadataNameAndByValue').and.callThrough();
        spyOn((autComp as DsDynamicSponsorAutocompleteComponent), 'isEUSponsor')
          .and.returnValue(true);
        spyOn((autComp as any).lookupRelationService, 'getExternalResults');

        autComp.search(observableOf('test')).subscribe(() => {
          expect((autComp as any).lookupRelationService.getExternalResults).toHaveBeenCalled();
          expect((autComp as any).metadataValueService.findByMetadataNameAndByValue).not.toHaveBeenCalled();
        });

        autFixture.detectChanges();
        flush();
      }));

      it('should search non eu when 3+ characters is typed', fakeAsync(() => {
        spyOn((autComp as any).metadataValueService, 'findByMetadataNameAndByValue').and.callThrough();
        spyOn((autComp as DsDynamicSponsorAutocompleteComponent), 'isEUSponsor')
          .and.returnValue(false);
        spyOn((autComp as any).lookupRelationService, 'getExternalResults');

        autComp.search(observableOf('test')).subscribe(() => {
          expect((autComp as any).lookupRelationService.getExternalResults).not.toHaveBeenCalled();
          expect((autComp as any).metadataValueService.findByMetadataNameAndByValue).toHaveBeenCalled();
        });

        autFixture.detectChanges();
        flush();
      }));
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {
  group: FormGroup = AUT_TEST_GROUP;
  model = new DsDynamicSponsorAutocompleteModel(AUT_TEST_MODEL_CONFIG);
  showErrorMessages = false;
}

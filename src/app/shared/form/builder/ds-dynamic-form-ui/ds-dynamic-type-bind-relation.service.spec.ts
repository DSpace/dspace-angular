import {inject, TestBed, waitForAsync} from '@angular/core/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DynamicFormControlEvent, DynamicFormControlRelation, DynamicFormValidationService,
  DynamicFormControlMatcher, DynamicFormRelationService,
  DynamicInputModel, MATCH_VISIBLE, OR_OPERATOR, HIDDEN_MATCHER, DYNAMIC_MATCHERS
} from '@ng-dynamic-forms/core';



import {
  mockInputWithTypeBindModel, MockRelationModel, mockDcTypeInputModel
} from '../../../mocks/form-models.mock';
import {DsDynamicTypeBindRelationService} from './ds-dynamic-type-bind-relation.service';
import {FormFieldMetadataValueObject} from "../models/form-field-metadata-value.model";
import {FormControl, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ReactiveFormsModule} from "@angular/forms";
import {FormBuilderService} from "../form-builder.service";
import {getMockFormBuilderService} from "../../../mocks/form-builder-service.mock";
import {DsDynamicFormComponent} from "./ds-dynamic-form.component";
import {DsDynamicInputModel} from "./models/ds-dynamic-input.model";
import {FieldParser} from "../parsers/field-parser";

describe('DSDynamicTypeBindRelationService test suite', () => {
  let service: DsDynamicTypeBindRelationService;
  let dynamicFormRelationService: DynamicFormRelationService;
  let dynamicFormControlMatchers: DynamicFormControlMatcher[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        //{ provide: FormBuilderService, useValue: getMockFormBuilderService() },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
        { provide: DsDynamicTypeBindRelationService, useClass: DsDynamicTypeBindRelationService },
        { provide: DynamicFormRelationService },
      ]
    }).compileComponents().then();
  });

  beforeEach(inject([DsDynamicTypeBindRelationService, DynamicFormRelationService],
    (relationService: DsDynamicTypeBindRelationService,
     formRelationService: DynamicFormRelationService
    ) => {
    service = relationService;
    dynamicFormRelationService = formRelationService;
    dynamicFormControlMatchers = [];
  }));

  describe('Test getTypeBindValue method', () => {
    it('Should get type bind "boundType" from the given metadata object value', () => {
        const mockMetadataValueObject: FormFieldMetadataValueObject = new FormFieldMetadataValueObject(
          'boundType', null, null, 'Bound Type'
        );
        const bindType = service.getTypeBindValue(mockMetadataValueObject);
        expect(bindType).toBe('boundType');
    });
    it('Should get type authority key "bound-auth-key" from the given metadata object value', () => {
      const mockMetadataValueObject: FormFieldMetadataValueObject = new FormFieldMetadataValueObject(
        'boundType', null, 'bound-auth-key', 'Bound Type'
      );
      const bindType = service.getTypeBindValue(mockMetadataValueObject);
      console.dir(bindType);
      expect(bindType).toBe('bound-auth-key');
    });
    it('Should get passed string returned directly as string passed instead of metadata', () => {
      const bindType = service.getTypeBindValue('rawString');
      expect(bindType).toBe('rawString');
    });
    it('Should get "undefined" returned directly as no object given', () => {
      const bindType = service.getTypeBindValue(undefined);
      expect(bindType).toBeUndefined();
    });
  });

  describe('Test getRelatedFormModel method', () => {
    it('Should get 0 related form models for simple type bind mock data', () => {
      const testModel = mockInputWithTypeBindModel;
      const relatedModels = service.getRelatedFormModel(testModel);
      expect(relatedModels).toHaveSize(0);
    });
    it('Should get 1 related form models for mock relation model data', () => {
      const testModel = MockRelationModel;
      testModel.typeBindRelations = getTypeBindRelations(['boundType']);
      const relatedModels = service.getRelatedFormModel(testModel);
      expect(relatedModels).toHaveSize(1);
    });
  });

  describe('Test matchesCondition method', () => {
    it('Should receive one subscription to dc.type type binding"', () => {
      const testModel = MockRelationModel;
      //testModel.typeBindRelations = getTypeBindRelations(['boundType']);
      const relatedModels = service.getRelatedFormModel(testModel);
      const dcTypeControl = new FormControl();
      dcTypeControl.setValue('boundType');
      expect(service.subscribeRelations(testModel, dcTypeControl)).toHaveSize(1);
    });

    it('TEST MTACHe"', () => {
      const testModel = MockRelationModel;
      testModel.typeBindRelations = getTypeBindRelations(['boundType']);
      const relatedModels = service.getRelatedFormModel(testModel);
      const dcTypeControl = new FormControl();
      dcTypeControl.setValue('boundType');
      testModel.typeBindRelations[0].when[0].value = 'asdfaf';
      const relation = dynamicFormRelationService.findRelationByMatcher((testModel as any).typeBindRelations, HIDDEN_MATCHER);
     // console.dir(relation);
    });
  });



});

function getTypeBindRelations(configuredTypeBindValues: string[]): DynamicFormControlRelation[] {
  const bindValues = [];
  configuredTypeBindValues.forEach((value) => {
    bindValues.push({
      id: 'dc.type',
      value: value
    });
  });
  return [{
    match: MATCH_VISIBLE,
    operator: OR_OPERATOR,
    when: bindValues
  }];
}

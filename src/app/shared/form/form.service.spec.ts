import { Store, StoreModule } from '@ngrx/store';
import { async, inject, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicInputModel
} from '@ng-dynamic-forms/core';

import { FormService } from './form.service';
import { FormBuilderService } from './builder/form-builder.service';
import { AppState } from '../../app.reducer';
import { formReducer } from './form.reducers';

describe('FormService test suite', () => {
  const formId = 'testForm';
  let service: FormService;
  let builderService: FormBuilderService;
  let formGroup: FormGroup;

  const formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({id: 'author', value: 'test'}),
    new DynamicInputModel({
      id: 'title',
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Title is required'
      }
    }),
    new DynamicInputModel({id: 'date'}),
    new DynamicInputModel({id: 'description'}),
  ];

  const formData = {
    author: ['test'],
    title: null,
    date: null,
    description: null
  };
  const formState = {
    testForm: {
      data: formData,
      valid: true,
      errors: []
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({formReducer})
      ],
      providers: [
        DynamicFormService,
        DynamicFormValidationService,
        FormBuilderService,
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Store, FormBuilderService], (store: Store<AppState>, formBuilderService: FormBuilderService) => {
    store
      .subscribe((state) => {
        state.forms = formState;
      });
    builderService = formBuilderService;
    formGroup = builderService.createFormGroup(formModel);
    service = new FormService(formBuilderService, store);
  }));

  it('should check whether form state is init', () => {
    service.isFormInitialized(formId).subscribe((init) => {
      expect(init).toBe(true);
    });
  });

  it('should return form status when isValid is called', () => {
    service.isValid(formId).subscribe((status) => {
      expect(status).toBe(true);
    });
  });

  it('should return form data when getFormData is called', () => {
    service.getFormData(formId).subscribe((data) => {
      expect(data).toBe(formData);
    });
  });

  it('should return form unique id', () => {
    const formId1 = service.getUniqueId(formId);
    const formId2 = service.getUniqueId(formId);

    expect(formId1).not.toEqual(formId2);
  });

  it('should validate all form fields', () => {
    service.validateAllFormFields(formGroup);

    expect(formGroup.controls.author.touched).toBe(true);
    expect(formGroup.controls.author.status).toBe('VALID');

    expect(formGroup.controls.title.touched).toBe(true);
    expect(formGroup.controls.title.status).toBe('INVALID');

    expect(formGroup.controls.date.touched).toBe(true);

    expect(formGroup.controls.description.touched).toBe(true);
  });

  it('should add error to field', () => {
    let control = builderService.getFormControlById('description', formGroup, formModel);
    let model = builderService.findById('description', formModel);
    let errorKeys: string[];

    service.addErrorToField(control, model, 'Test error message');
    errorKeys = Object.keys(control.errors);

    expect(errorKeys.length).toBe(1);

    expect(control.hasError(errorKeys[0])).toBe(true);

    expect(formGroup.controls.description.touched).toBe(true);

    control = builderService.getFormControlById('title', formGroup, formModel);
    model = builderService.findById('title', formModel);
    service.addErrorToField(control, model, 'error.required');
    errorKeys = Object.keys(control.errors);

    expect(errorKeys.length).toBe(1);

    expect(control.hasError(errorKeys[0])).toBe(true);

    expect(formGroup.controls.description.touched).toBe(true);
  });

  it('should remove error from field', () => {
    let control = builderService.getFormControlById('description', formGroup, formModel);
    let model = builderService.findById('description', formModel);
    let errorKeys: string[];

    service.addErrorToField(control, model, 'Test error message');
    errorKeys = Object.keys(control.errors);

    service.removeErrorFromField(control, model, errorKeys[0]);

    expect(errorKeys.length).toBe(1);

    expect(control.hasError(errorKeys[0])).toBe(false);

    expect(formGroup.controls.description.touched).toBe(false);

    control = builderService.getFormControlById('title', formGroup, formModel);
    model = builderService.findById('title', formModel);

    service.addErrorToField(control, model, 'error.required');
    errorKeys = Object.keys(control.errors);

    service.removeErrorFromField(control, model, errorKeys[0]);

    expect(errorKeys.length).toBe(1);

    expect(control.hasError(errorKeys[0])).toBe(false);

    expect(formGroup.controls.description.touched).toBe(false);
  });
});

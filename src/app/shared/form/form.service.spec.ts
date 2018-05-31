import { Store, StoreModule } from '@ngrx/store';
import { async, inject, TestBed } from '@angular/core/testing';
import 'rxjs/add/observable/of';
import { FormService } from './form.service';
import { FormBuilderService } from './builder/form-builder.service';
import { AppState } from '../../app.reducer';
import { DynamicPathable } from '@ng-dynamic-forms/core/src/model/misc/dynamic-form-control-path.model';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { formReducer } from './form.reducers';

describe('FormService', () => {
  const formId = 'testForm';
  let service: FormService;
  const formData = {
    'dc.contributor.author': null,
    'dc.title': ['test'],
    'dc.date.issued': null,
    'dc.description': null
  };
  const formState = {
    testForm: {
      data: formData,
      valid: true,
      errors: []
    }
  };

  const formBuilderServiceStub: any = {
    getPath: (model: DynamicPathable) => [],
    /* tslint:disable:no-empty */
    clearAllModelsValue: (groupModel: DynamicFormControlModel[]) => {
    }
    /* tslint:enable:no-empty */
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({formReducer})
      ],
      providers: [
        {provide: FormBuilderService, useValue: formBuilderServiceStub},
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (store: Store<AppState>) => {
    store
      .subscribe((state) => {
        state.forms = formState;
      });
    service = new FormService(formBuilderServiceStub, store);
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

});

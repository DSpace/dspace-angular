import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService,
} from '../../../../../testing/dynamic-form-mock-services';
import { DsDynamicDisabledComponent } from './dynamic-disabled.component';
import { DynamicDisabledModel } from './dynamic-disabled.model';

describe('DsDynamicDisabledComponent', () => {
  let comp: DsDynamicDisabledComponent;
  let fixture: ComponentFixture<DsDynamicDisabledComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let model;
  let group;

  function init() {
    model = new DynamicDisabledModel({
      value: 'test',
      repeatable: false,
      metadataFields: [],
      submissionId: '1234',
      id: 'disabledInput',
      name: 'disabledInput',
      hasSelectableMetadata: false,
    });
    group = new UntypedFormGroup({
      disabledInput: new UntypedFormControl(),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot(), DsDynamicDisabledComponent],
      providers: [
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicDisabledComponent);
    comp = fixture.componentInstance; // DsDynamicDisabledComponent test instance
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.model = model;
    comp.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a disabled input', () => {
    const input = de.query(By.css('input'));
    expect(input.nativeElement.getAttribute('disabled')).toEqual('');
  });
});

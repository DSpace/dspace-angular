// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import {
  DynamicFormLayoutService,
  DynamicFormsCoreModule,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { NgbModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { DsDynamicTagComponent } from './dynamic-tag.component';
import { DynamicTagModel } from './dynamic-tag.model';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { Chips } from '../../../../../chips/models/chips.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { createTestComponent } from '../../../../../testing/utils';
import { MOCK_SUBMISSION_CONFIG } from '../../../../../testing/mock-submission-config';

function createKeyUpEvent(key: number) {
  /* tslint:disable:no-empty */
  const event = {
    keyCode: key, preventDefault: () => {
    }, stopPropagation: () => {
    }
  };
  /* tslint:enable:no-empty */
  spyOn(event, 'preventDefault');
  spyOn(event, 'stopPropagation');
  return event;
}

let TAG_TEST_GROUP;
let TAG_TEST_MODEL_CONFIG;
const envConfig: GlobalConfig = MOCK_SUBMISSION_CONFIG;

function init() {
  TAG_TEST_GROUP = new FormGroup({
    tag: new FormControl(),
  });

  TAG_TEST_MODEL_CONFIG = {
    authorityOptions: {
      closed: false,
      metadata: 'tag',
      name: 'common_iso_languages',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as AuthorityOptions,
    disabled: false,
    id: 'tag',
    label: 'Keywords',
    minChars: 3,
    name: 'tag',
    placeholder: 'Keywords',
    readOnly: false,
    required: false,
    repeatable: false
  };
}

describe('DsDynamicTagComponent test suite', () => {

  let testComp: TestComponent;
  let tagComp: DsDynamicTagComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let tagFixture: ComponentFixture<DsDynamicTagComponent>;
  let html;
  let chips: Chips;
  let modelValue: any;

  // async beforeEach
  beforeEach(async(() => {
    const authorityServiceStub = new AuthorityServiceStub();
    init();
    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      declarations: [
        DsDynamicTagComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicTagComponent,
        { provide: AuthorityService, useValue: authorityServiceStub },
        { provide: GLOBAL_CONFIG, useValue: envConfig },
        { provide: DynamicFormLayoutService, useValue: {} },
        { provide: DynamicFormValidationService, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-tag [bindId]="bindId"
                      [group]="group"
                      [model]="model"
                      (blur)="onBlur($event)"
                      (change)="onValueChange($event)"
                      (focus)="onFocus($event)"></ds-dynamic-tag>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });
    afterEach(() => {
      testFixture.destroy();
    });
    it('should create DsDynamicTagComponent', inject([DsDynamicTagComponent], (app: DsDynamicTagComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('when authorityOptions are set', () => {
    describe('and init model value is empty', () => {
      beforeEach(() => {

        tagFixture = TestBed.createComponent(DsDynamicTagComponent);
        tagComp = tagFixture.componentInstance; // FormComponent test instance
        tagComp.group = TAG_TEST_GROUP;
        tagComp.model = new DynamicTagModel(TAG_TEST_MODEL_CONFIG);
        tagFixture.detectChanges();
      });

      afterEach(() => {
        tagFixture.destroy();
        tagComp = null;
      });

      it('should init component properly', () => {
        chips = new Chips([], 'display');
        expect(tagComp.chips.getChipsItems()).toEqual(chips.getChipsItems());

        expect(tagComp.searchOptions).toBeDefined();
      });

      it('should search when 3+ characters typed', fakeAsync(() => {
        spyOn((tagComp as any).authorityService, 'getEntriesByName').and.callThrough();

        tagComp.search(observableOf('test')).subscribe(() => {
          expect((tagComp as any).authorityService.getEntriesByName).toHaveBeenCalled();
        });
      }));

      it('should select a results entry properly', fakeAsync(() => {
        modelValue = [
          Object.assign(new AuthorityValue(), { id: 1, display: 'Name, Lastname', value: 1 })
        ];
        const event: NgbTypeaheadSelectItemEvent = {
          item: Object.assign(new AuthorityValue(), {
            id: 1,
            display: 'Name, Lastname',
            value: 1
          }),
          preventDefault: () => {
            return;
          }
        };
        spyOn(tagComp.change, 'emit');

        tagComp.onSelectItem(event);

        tagFixture.detectChanges();
        flush();

        expect(tagComp.chips.getChipsItems()).toEqual(modelValue);
        expect(tagComp.model.value).toEqual(modelValue);
        expect(tagComp.currentValue).toBeNull();
        expect(tagComp.change.emit).toHaveBeenCalled();
      }));

      it('should emit blur Event onBlur', () => {
        spyOn(tagComp.blur, 'emit');
        tagComp.onBlur(new Event('blur'));
        expect(tagComp.blur.emit).toHaveBeenCalled();
      });

      it('should emit focus Event onFocus', () => {
        spyOn(tagComp.focus, 'emit');
        tagComp.onFocus(new Event('focus'));
        expect(tagComp.focus.emit).toHaveBeenCalled();
      });

      it('should emit change Event onBlur when currentValue is not empty', fakeAsync(() => {
        tagComp.currentValue = 'test value';
        tagFixture.detectChanges();
        spyOn(tagComp.blur, 'emit');
        spyOn(tagComp.change, 'emit');
        tagComp.onBlur(new Event('blur'));

        tagFixture.detectChanges();
        flush();

        expect(tagComp.change.emit).toHaveBeenCalled();
        expect(tagComp.blur.emit).toHaveBeenCalled();
      }));
    });

    describe('and init model value is not empty', () => {
      beforeEach(() => {

        tagFixture = TestBed.createComponent(DsDynamicTagComponent);
        tagComp = tagFixture.componentInstance; // FormComponent test instance
        tagComp.group = TAG_TEST_GROUP;
        tagComp.model = new DynamicTagModel(TAG_TEST_MODEL_CONFIG);
        modelValue = [
          new FormFieldMetadataValueObject('a', null, 'test001'),
          new FormFieldMetadataValueObject('b', null, 'test002'),
          new FormFieldMetadataValueObject('c', null, 'test003'),
        ];
        tagComp.model.value = modelValue;
        tagFixture.detectChanges();
      });

      afterEach(() => {
        tagFixture.destroy();
        tagComp = null;
      });

      it('should init component properly', () => {
        chips = new Chips(modelValue, 'display');
        expect(tagComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
        expect(tagComp.searchOptions).toBeDefined();
      });
    });

  });

  describe('when authorityOptions are not set', () => {
    describe('and init model value is empty', () => {
      beforeEach(() => {

        tagFixture = TestBed.createComponent(DsDynamicTagComponent);
        tagComp = tagFixture.componentInstance; // FormComponent test instance
        tagComp.group = TAG_TEST_GROUP;
        const config = TAG_TEST_MODEL_CONFIG;
        config.authorityOptions = null;
        tagComp.model = new DynamicTagModel(config);
        tagFixture.detectChanges();
      });

      afterEach(() => {
        tagFixture.destroy();
        tagComp = null;
      });

      it('should init component properly', () => {
        chips = new Chips([], 'display');
        expect(tagComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
        expect(tagComp.searchOptions).not.toBeDefined();
      });

      it('should add an item on ENTER or key press is \',\' or \';\'', fakeAsync(() => {
        let event = createKeyUpEvent(13);
        tagComp.currentValue = 'test value';

        tagFixture.detectChanges();
        tagComp.onKeyUp(event);

        flush();

        expect(tagComp.model.value).toEqual(['test value']);
        expect(tagComp.currentValue).toBeNull();

        event = createKeyUpEvent(188);
        tagComp.currentValue = 'test value';

        tagFixture.detectChanges();
        tagComp.onKeyUp(event);

        flush();

        expect(tagComp.model.value).toEqual(['test value']);
        expect(tagComp.currentValue).toBeNull();
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

  group: FormGroup = TAG_TEST_GROUP;

  model = new DynamicTagModel(TAG_TEST_MODEL_CONFIG);

  showErrorMessages = false;

}

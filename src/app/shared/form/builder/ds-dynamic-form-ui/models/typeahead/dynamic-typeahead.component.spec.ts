// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormLayoutService, DynamicFormsCoreModule, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyServiceStub } from '../../../../../testing/vocabulary-service.stub';
import { DsDynamicTypeaheadComponent } from './dynamic-typeahead.component';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { createTestComponent } from '../../../../../testing/utils.test';
import { AuthorityConfidenceStateDirective } from '../../../../../authority-confidence/authority-confidence-state.directive';
import { ObjNgFor } from '../../../../../utils/object-ngfor.pipe';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../remote-data.utils';
import { VocabularyTreeviewComponent } from '../../../../../vocabulary-treeview/vocabulary-treeview.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

export let TYPEAHEAD_TEST_GROUP;

export let TYPEAHEAD_TEST_MODEL_CONFIG;

function init() {
  TYPEAHEAD_TEST_GROUP = new FormGroup({
    typeahead: new FormControl(),
  });

  TYPEAHEAD_TEST_MODEL_CONFIG = {
    vocabularyOptions: {
      closed: false,
      metadata: 'typeahead',
      name: 'vocabulary',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as VocabularyOptions,
    disabled: false,
    id: 'typeahead',
    label: 'Conference',
    minChars: 3,
    name: 'typeahead',
    placeholder: 'Conference',
    readOnly: false,
    required: false,
    repeatable: false,
    value: undefined
  };
}

describe('DsDynamicTypeaheadComponent test suite', () => {

  let scheduler: TestScheduler;
  let testComp: TestComponent;
  let typeaheadComp: DsDynamicTypeaheadComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let typeaheadFixture: ComponentFixture<DsDynamicTypeaheadComponent>;
  let vocabularyServiceStub: any;
  let html;
  let modal;
  let vocabulary = {
    id: 'vocabulary',
    name: 'vocabulary',
    scrollable: true,
    hierarchical: false,
    preloadLevel: 0,
    type: 'vocabulary',
    _links: {
      self: {
        url: 'self'
      },
      entries: {
        url: 'entries'
      }
    }
  }

  let hierarchicalVocabulary = {
    id: 'hierarchicalVocabulary',
    name: 'hierarchicalVocabulary',
    scrollable: true,
    hierarchical: true,
    preloadLevel: 2,
    type: 'vocabulary',
    _links: {
      self: {
        url: 'self'
      },
      entries: {
        url: 'entries'
      }
    }
  }

  // async beforeEach
  beforeEach(async(() => {
    vocabularyServiceStub = new VocabularyServiceStub();
    modal = jasmine.createSpyObj('modal', ['open', 'close', 'dismiss']);
/*    jasmine.createSpyObj('modal',
      {
        open: jasmine.createSpy('open'),
        close: jasmine.createSpy('close'),
        dismiss: jasmine.createSpy('dismiss'),
      }
    );*/
    init();
    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        CdkTreeModule
      ],
      declarations: [
        DsDynamicTypeaheadComponent,
        TestComponent,
        AuthorityConfidenceStateDirective,
        ObjNgFor,
        VocabularyTreeviewComponent
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicTypeaheadComponent,
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: DynamicFormLayoutService, useValue: {} },
        { provide: DynamicFormValidationService, useValue: {} },
        { provide: NgbModal, useValue: modal }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-typeahead [bindId]="bindId"
                            [group]="group"
                            [model]="model"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-typeahead>`;

      spyOn(vocabularyServiceStub, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabulary));
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });
    it('should create DsDynamicTypeaheadComponent', inject([DsDynamicTypeaheadComponent], (app: DsDynamicTypeaheadComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Has not hierarchical vocabulary', () => {
    beforeEach(() => {
      spyOn(vocabularyServiceStub, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabulary));
    });

    describe('when init model value is empty', () => {
      beforeEach(() => {

        typeaheadFixture = TestBed.createComponent(DsDynamicTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', () => {
        expect(typeaheadComp.currentValue).not.toBeDefined();
      });

      it('should search when 3+ characters typed', fakeAsync(() => {

        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntriesByValue').and.callThrough();

        typeaheadComp.search(observableOf('test')).subscribe();

        tick(300);
        typeaheadFixture.detectChanges();

        expect((typeaheadComp as any).vocabularyService.getVocabularyEntriesByValue).toHaveBeenCalled();
      }));

      it('should set model.value on input type when VocabularyOptions.closed is false', () => {
        const inputDe = typeaheadFixture.debugElement.query(By.css('input.form-control'));
        const inputElement = inputDe.nativeElement;

        inputElement.value = 'test value';
        inputElement.dispatchEvent(new Event('input'));

        expect(typeaheadComp.inputValue).toEqual(new FormFieldMetadataValueObject('test value'))

      });

      it('should not set model.value on input type when VocabularyOptions.closed is true', () => {
        typeaheadComp.model.vocabularyOptions.closed = true;
        typeaheadFixture.detectChanges();
        const inputDe = typeaheadFixture.debugElement.query(By.css('input.form-control'));
        const inputElement = inputDe.nativeElement;

        inputElement.value = 'test value';
        inputElement.dispatchEvent(new Event('input'));

        expect(typeaheadComp.model.value).not.toBeDefined();

      });

      it('should emit blur Event onBlur when popup is closed', () => {
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur'));
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit blur Event onBlur when popup is opened', () => {
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(true);
        const input = typeaheadFixture.debugElement.query(By.css('input'));

        input.nativeElement.blur();
        expect(typeaheadComp.blur.emit).not.toHaveBeenCalled();
      });

      it('should emit change Event onBlur when VocabularyOptions.closed is false and inputValue is changed', () => {
        typeaheadComp.inputValue = 'test value';
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur',));
        expect(typeaheadComp.change.emit).toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit change Event onBlur when VocabularyOptions.closed is false and inputValue is not changed', () => {
        typeaheadComp.inputValue = 'test value';
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        (typeaheadComp.model as any).value = 'test value';
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur',));
        expect(typeaheadComp.change.emit).not.toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit change Event onBlur when VocabularyOptions.closed is false and inputValue is null', () => {
        typeaheadComp.inputValue = null;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        (typeaheadComp.model as any).value = 'test value';
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur',));
        expect(typeaheadComp.change.emit).not.toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should emit focus Event onFocus', () => {
        spyOn(typeaheadComp.focus, 'emit');
        typeaheadComp.onFocus(new Event('focus'));
        expect(typeaheadComp.focus.emit).toHaveBeenCalled();
      });

    });

    describe('when init model value is not empty', () => {
      beforeEach(() => {
        typeaheadFixture = TestBed.createComponent(DsDynamicTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        const entry = observableOf(Object.assign(new VocabularyEntry(), {
          authority: null,
          value: 'test',
          display: 'testDisplay'
        }));
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByValue').and.returnValue(entry);
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByID').and.returnValue(entry);
        (typeaheadComp.model as any).value = new FormFieldMetadataValueObject('test', null, null, 'testDisplay');
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', fakeAsync(() => {
        tick();
        expect(typeaheadComp.currentValue).toEqual(new FormFieldMetadataValueObject('test', null, null, 'testDisplay'));
        expect((typeaheadComp as any).vocabularyService.getVocabularyEntryByValue).toHaveBeenCalled();
      }));

      it('should emit change Event onChange and currentValue is empty', () => {
        typeaheadComp.currentValue = null;
        spyOn(typeaheadComp.change, 'emit');
        typeaheadComp.onChange(new Event('change'));
        expect(typeaheadComp.change.emit).toHaveBeenCalled();
        expect(typeaheadComp.model.value).toBeNull();
      });
    });

    describe('when init model value is not empty and has authority', () => {
      beforeEach(() => {
        typeaheadFixture = TestBed.createComponent(DsDynamicTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        const entry = observableOf(Object.assign(new VocabularyEntry(), {
          authority: 'test001',
          value: 'test001',
          display: 'test'
        }));
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByValue').and.returnValue(entry);
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByID').and.returnValue(entry);
        (typeaheadComp.model as any).value = new FormFieldMetadataValueObject('test', null, 'test001');
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', fakeAsync(() => {
        tick();
        expect(typeaheadComp.currentValue).toEqual(new FormFieldMetadataValueObject('test001', null, 'test001', 'test'));
        expect((typeaheadComp as any).vocabularyService.getVocabularyEntryByID).toHaveBeenCalled();
      }));

      it('should emit change Event onChange and currentValue is empty', () => {
        typeaheadComp.currentValue = null;
        spyOn(typeaheadComp.change, 'emit');
        typeaheadComp.onChange(new Event('change'));
        expect(typeaheadComp.change.emit).toHaveBeenCalled();
        expect(typeaheadComp.model.value).toBeNull();
      });
    });
  });

  describe('Has hierarchical vocabulary', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      spyOn(vocabularyServiceStub, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(hierarchicalVocabulary));
    });

    describe('when init model value is empty', () => {
      beforeEach(() => {

        typeaheadFixture = TestBed.createComponent(DsDynamicTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', () => {
        expect(typeaheadComp.currentValue).not.toBeDefined();
      });

      it('should open tree properly', () => {
        scheduler.schedule(() => typeaheadComp.openTree(new Event('click')));
        scheduler.flush();

        expect((typeaheadComp as any).modalService.open).toHaveBeenCalled();
      });
    });

    describe('when init model value is not empty', () => {
      beforeEach(() => {
        typeaheadFixture = TestBed.createComponent(DsDynamicTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);
        const entry = observableOf(Object.assign(new VocabularyEntry(), {
          authority: null,
          value: 'test',
          display: 'testDisplay'
        }));
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByValue').and.returnValue(entry);
        spyOn((typeaheadComp as any).vocabularyService, 'getVocabularyEntryByID').and.returnValue(entry);
        (typeaheadComp.model as any).value = new FormFieldMetadataValueObject('test', null, null, 'testDisplay');
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', fakeAsync(() => {
        tick();
        expect(typeaheadComp.currentValue).toEqual(new FormFieldMetadataValueObject('test', null, null, 'testDisplay'));
        expect((typeaheadComp as any).vocabularyService.getVocabularyEntryByValue).toHaveBeenCalled();
      }));

      it('should open tree properly', () => {
        scheduler.schedule(() => typeaheadComp.openTree(new Event('click')));
        scheduler.flush();

        expect((typeaheadComp as any).modalService.open).toHaveBeenCalled();
      });
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group: FormGroup = TYPEAHEAD_TEST_GROUP;

  model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);

}

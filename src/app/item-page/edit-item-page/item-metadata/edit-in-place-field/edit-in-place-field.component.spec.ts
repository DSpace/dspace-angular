import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { MetadataFieldDataService } from '../../../../core/data/metadata-field-data.service';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { MetadatumViewModel } from '../../../../core/shared/metadata.models';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { EditInPlaceFieldComponent } from './edit-in-place-field.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { DebounceDirective } from '../../../../shared/utils/debounce.directive';
import { ValidationSuggestionsComponent } from '../../../../shared/input-suggestions/validation-suggestions/validation-suggestions.component';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';

let comp: EditInPlaceFieldComponent;
let fixture: ComponentFixture<EditInPlaceFieldComponent>;
let de: DebugElement;
let el: HTMLElement;
let metadataFieldService;
let objectUpdatesService;
let paginatedMetadataFields;
const mdSchema = Object.assign(new MetadataSchema(), { prefix: 'dc' });
const mdSchemaRD$ = createSuccessfulRemoteDataObject$(mdSchema);
const mdField1 = Object.assign(new MetadataField(), {
  schema: mdSchemaRD$,
  element: 'contributor',
  qualifier: 'author'
});
const mdField2 = Object.assign(new MetadataField(), {
  schema: mdSchemaRD$,
  element: 'title'
});
const mdField3 = Object.assign(new MetadataField(), {
  schema: mdSchemaRD$,
  element: 'description',
  qualifier: 'abstract',
});

const metadatum = Object.assign(new MetadatumViewModel(), {
  key: 'dc.description.abstract',
  value: 'Example abstract',
  language: 'en'
});

const url = 'http://test-url.com/test-url';
const fieldUpdate = {
  field: metadatum,
  changeType: undefined
};
let scheduler: TestScheduler;

describe('EditInPlaceFieldComponent', () => {

  beforeEach(waitForAsync(() => {
    scheduler = getTestScheduler();

    paginatedMetadataFields = buildPaginatedList(undefined, [mdField1, mdField2, mdField3]);

    metadataFieldService = jasmine.createSpyObj({
      queryMetadataFields: createSuccessfulRemoteDataObject$(paginatedMetadataFields),
    });
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        saveChangeFieldUpdate: {},
        saveRemoveFieldUpdate: {},
        setEditableFieldUpdate: {},
        setValidFieldUpdate: {},
        removeSingleFieldUpdate: {},
        isEditable: observableOf(false), // should always return something --> its in ngOnInit
        isValid: observableOf(true) // should always return something --> its in ngOnInit
      }
    );

    TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot()],
      declarations: [
        EditInPlaceFieldComponent,
        MockDirective(DebounceDirective),
        MockComponent(ValidationSuggestionsComponent)
      ],
      providers: [
        { provide: RegistryService, useValue: metadataFieldService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: MetadataFieldDataService, useValue: {} }
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInPlaceFieldComponent);
    comp = fixture.componentInstance; // EditInPlaceFieldComponent test instance
    de = fixture.debugElement;
    el = de.nativeElement;

    comp.url = url;
    comp.fieldUpdate = fieldUpdate;
    comp.metadata = metadatum;
  });

  describe('update', () => {
    beforeEach(() => {
      comp.update();
      fixture.detectChanges();
    });

    it('it should call saveChangeFieldUpdate on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.saveChangeFieldUpdate).toHaveBeenCalledWith(url, metadatum);
    });
  });

  describe('setEditable', () => {
    const editable = false;
    beforeEach(() => {
      comp.setEditable(editable);
      fixture.detectChanges();
    });

    it('it should call setEditableFieldUpdate on the objectUpdatesService with the correct url and uuid and false', () => {
      expect(objectUpdatesService.setEditableFieldUpdate).toHaveBeenCalledWith(url, metadatum.uuid, editable);
    });
  });

  describe('editable is true', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should contain input fields or textareas', () => {
      const inputField = de.queryAll(By.css('input'));
      const textAreas = de.queryAll(By.css('textarea'));
      expect(inputField.length + textAreas.length).toBeGreaterThan(0);
    });
  });

  describe('editable is false', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('the div should contain no input fields or textareas', () => {
      const inputField = de.queryAll(By.css('input'));
      const textAreas = de.queryAll(By.css('textarea'));
      expect(inputField.length + textAreas.length).toBe(0);
    });
  });

  describe('isValid is true', () => {
    beforeEach(() => {
      objectUpdatesService.isValid.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should not contain an error message', () => {
      const errorMessages = de.queryAll(By.css('small.text-danger'));
      expect(errorMessages.length).toBe(0);

    });
  });

  describe('isValid is false', () => {
    beforeEach(() => {
      objectUpdatesService.isValid.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('there should be an error message', () => {
      const errorMessages = de.queryAll(By.css('small.text-danger'));
      expect(errorMessages.length).toBeGreaterThan(0);

    });
  });

  describe('remove', () => {
    beforeEach(() => {
      comp.remove();
      fixture.detectChanges();
    });

    it('it should call saveRemoveFieldUpdate on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(url, metadatum);
    });
  });

  describe('removeChangesFromField', () => {
    beforeEach(() => {
      comp.removeChangesFromField();
      fixture.detectChanges();
    });

    it('it should call removeChangesFromField on the objectUpdatesService with the correct url and uuid', () => {
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, metadatum.uuid);
    });
  });

  describe('findMetadataFieldSuggestions', () => {
    const query = 'query string';

    const metadataFieldSuggestions: InputSuggestion[] =
      [
        {
          displayValue: ('dc.' + mdField1.toString()).split('.').join('.&#8203;'),
          value: ('dc.' + mdField1.toString())
        },
        {
          displayValue: ('dc.' + mdField2.toString()).split('.').join('.&#8203;'),
          value: ('dc.' + mdField2.toString())
        },
        {
          displayValue: ('dc.' + mdField3.toString()).split('.').join('.&#8203;'),
          value: ('dc.' + mdField3.toString())
        }
      ];

    beforeEach(fakeAsync(() => {
      comp.findMetadataFieldSuggestions(query);
      tick();
      fixture.detectChanges();
    }));

    it('it should call queryMetadataFields on the metadataFieldService with the correct query', () => {
      expect(metadataFieldService.queryMetadataFields).toHaveBeenCalledWith(query, null, true, false, followLink('schema'));
    });

    it('it should set metadataFieldSuggestions to the right value', () => {
      const expected = 'a';
      scheduler.expectObservable(comp.metadataFieldSuggestions).toBe(expected, { a: metadataFieldSuggestions });
    });
  });

  describe('canSetEditable', () => {
    describe('when editable is currently true', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        fixture.detectChanges();
      });

      it('canSetEditable should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: false });
      });
    });

    describe('when editable is currently false', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(false));
        fixture.detectChanges();
      });

      describe('when the fieldUpdate\'s changeType is currently not REMOVE', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = FieldChangeType.ADD;
          fixture.detectChanges();
        });
        it('canSetEditable should return an observable emitting true', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: true });
        });
      });

      describe('when the fieldUpdate\'s changeType is currently REMOVE', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = FieldChangeType.REMOVE;
          fixture.detectChanges();
        });
        it('canSetEditable should return an observable emitting false', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: false });
        });
      });
    });
  });

  describe('canSetUneditable', () => {
    describe('when editable is currently true', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        fixture.detectChanges();
      });

      it('canSetUneditable should return an observable emitting true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetUneditable()).toBe(expected, { a: true });
      });
    });

    describe('when editable is currently false', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(false));
        fixture.detectChanges();
      });

      it('canSetUneditable should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetUneditable()).toBe(expected, { a: false });
      });
    });
  });

  describe('when canSetEditable emits true', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(false));
      spyOn(comp, 'canSetEditable').and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should have an enabled button with an edit icon', () => {
      const editIcon = de.query(By.css('i.fa-edit')).parent.nativeElement.disabled;
      expect(editIcon).toBe(false);
    });
  });

  describe('when canSetEditable emits false', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(false));
      spyOn(comp, 'canSetEditable').and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('the div should have a disabled button with an edit icon', () => {
      const editIcon = de.query(By.css('i.fa-edit')).parent.nativeElement.disabled;
      expect(editIcon).toBe(true);
    });
  });

  describe('when canSetUneditable emits true', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(true));
      spyOn(comp, 'canSetUneditable').and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should have an enabled button with a check icon', () => {
      const checkButtonAttrs = de.query(By.css('i.fa-check')).parent.nativeElement.disabled;
      expect(checkButtonAttrs).toBe(false);
    });
  });

  describe('when canSetUneditable emits false', () => {
    beforeEach(() => {
      objectUpdatesService.isEditable.and.returnValue(observableOf(true));
      spyOn(comp, 'canSetUneditable').and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('the div should have a disabled button with a check icon', () => {
      const checkButtonAttrs = de.query(By.css('i.fa-check')).parent.nativeElement.disabled;
      expect(checkButtonAttrs).toBe(true);
    });
  });

  describe('when canRemove emits true', () => {
    beforeEach(() => {
      spyOn(comp, 'canRemove').and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should have an enabled button with a trash icon', () => {
      const trashButtonAttrs = de.query(By.css('i.fa-trash-alt')).parent.nativeElement.disabled;
      expect(trashButtonAttrs).toBe(false);
    });
  });

  describe('when canRemove emits false', () => {
    beforeEach(() => {
      spyOn(comp, 'canRemove').and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('the div should have a disabled button with a trash icon', () => {
      const trashButtonAttrs = de.query(By.css('i.fa-trash-alt')).parent.nativeElement.disabled;
      expect(trashButtonAttrs).toBe(true);
    });
  });

  describe('when canUndo emits true', () => {
    beforeEach(() => {
      spyOn(comp, 'canUndo').and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('the div should have an enabled button with an undo icon', () => {
      const undoIcon = de.query(By.css('i.fa-undo-alt')).parent.nativeElement.disabled;
      expect(undoIcon).toBe(false);
    });
  });

  describe('when canUndo emits false', () => {
    beforeEach(() => {
      spyOn(comp, 'canUndo').and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('the div should have a disabled button with an undo icon', () => {
      const undoIcon = de.query(By.css('i.fa-undo-alt')).parent.nativeElement.disabled;
      expect(undoIcon).toBe(true);
    });
  });

  describe('canRemove', () => {
    describe('when the fieldUpdate\'s changeType is currently not REMOVE or ADD', () => {
      beforeEach(() => {
        comp.fieldUpdate.changeType = FieldChangeType.UPDATE;
        fixture.detectChanges();
      });
      it('canRemove should return an observable emitting true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canRemove()).toBe(expected, { a: true });
      });
    });

    describe('when the fieldUpdate\'s changeType is currently ADD', () => {
      beforeEach(() => {
        comp.fieldUpdate.changeType = FieldChangeType.ADD;
        fixture.detectChanges();
      });
      it('canRemove should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canRemove()).toBe(expected, { a: false });
      });
    });
  });

  describe('canUndo', () => {

    describe('when editable is currently true', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        comp.fieldUpdate.changeType = undefined;
        fixture.detectChanges();
      });
      it('canUndo should return an observable emitting true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canUndo()).toBe(expected, { a: true });
      });
    });

    describe('when editable is currently false', () => {
      describe('when the fieldUpdate\'s changeType is currently ADD, UPDATE or REMOVE', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = FieldChangeType.ADD;
          fixture.detectChanges();
        });

        it('canUndo should return an observable emitting true', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canUndo()).toBe(expected, { a: true });
        });
      });

      describe('when the fieldUpdate\'s changeType is currently undefined', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = undefined;
          fixture.detectChanges();
        });

        it('canUndo should return an observable emitting false', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canUndo()).toBe(expected, { a: false });
        });
      });
    });

  });

  describe('canEditMetadataField', () => {
    describe('when the fieldUpdate\'s changeType is currently ADD', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        comp.fieldUpdate.changeType = FieldChangeType.ADD;
        fixture.detectChanges();
      });
      it('can edit metadata field', () => {
        const disabledMetadataField = fixture.debugElement.query(By.css('ds-validation-suggestions'))
          .componentInstance.disable;
       expect(disabledMetadataField).toBe(false);
      });
    });
    describe('when the fieldUpdate\'s changeType is currently REMOVE', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        comp.fieldUpdate.changeType = FieldChangeType.REMOVE;
        fixture.detectChanges();
      });
      it('can edit metadata field', () => {
        const disabledMetadataField = fixture.debugElement.query(By.css('ds-validation-suggestions'))
          .componentInstance.disable;
        expect(disabledMetadataField).toBe(true);
      });
    });
    describe('when the fieldUpdate\'s changeType is currently UPDATE', () => {
      beforeEach(() => {
        objectUpdatesService.isEditable.and.returnValue(observableOf(true));
        comp.fieldUpdate.changeType = FieldChangeType.UPDATE;
        fixture.detectChanges();
      });
      it('can edit metadata field', () => {
        const disabledMetadataField = fixture.debugElement.query(By.css('ds-validation-suggestions'))
          .componentInstance.disable;
        expect(disabledMetadataField).toBe(true);
      });
    });
  });
});

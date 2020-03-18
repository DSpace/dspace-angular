import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { MetadatumViewModel } from '../../../../core/shared/metadata.models';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { SharedModule } from '../../../../shared/shared.module';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { EditInPlaceFieldComponent } from './edit-in-place-field.component';

let comp: EditInPlaceFieldComponent;
let fixture: ComponentFixture<EditInPlaceFieldComponent>;
let de: DebugElement;
let el: HTMLElement;
let metadataFieldService;
let objectUpdatesService;
let paginatedMetadataFields;
const mdSchema = Object.assign(new MetadataSchema(), { prefix: 'dc' })
const mdField1 = Object.assign(new MetadataField(), {
  schema: mdSchema,
  element: 'contributor',
  qualifier: 'author'
});
const mdField2 = Object.assign(new MetadataField(), { schema: mdSchema, element: 'title' });
const mdField3 = Object.assign(new MetadataField(), {
  schema: mdSchema,
  element: 'description',
  qualifier: 'abstract'
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

  beforeEach(async(() => {
    scheduler = getTestScheduler();

    paginatedMetadataFields = new PaginatedList(undefined, [mdField1, mdField2, mdField3]);

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
      imports: [FormsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [EditInPlaceFieldComponent],
      providers: [
        { provide: RegistryService, useValue: metadataFieldService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
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

    fixture.detectChanges();
  });

  describe('update', () => {
    beforeEach(() => {
      comp.update();
    });

    it('it should call saveChangeFieldUpdate on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.saveChangeFieldUpdate).toHaveBeenCalledWith(url, metadatum);
    });
  });

  describe('setEditable', () => {
    const editable = false;
    beforeEach(() => {
      comp.setEditable(editable);
    });

    it('it should call setEditableFieldUpdate on the objectUpdatesService with the correct url and uuid and false', () => {
      expect(objectUpdatesService.setEditableFieldUpdate).toHaveBeenCalledWith(url, metadatum.uuid, editable);
    });
  });

  describe('editable is true', () => {
    beforeEach(() => {
      comp.editable = observableOf(true);
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
      comp.editable = observableOf(false);
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
      comp.valid = observableOf(true);
      fixture.detectChanges();
    });
    it('the div should not contain an error message', () => {
      const errorMessages = de.queryAll(By.css('small.text-danger'));
      expect(errorMessages.length).toBe(0);

    });
  });

  describe('isValid is false', () => {
    beforeEach(() => {
      comp.valid = observableOf(false);
      fixture.detectChanges();
    });
    it('the div should contain no input fields or textareas', () => {
      const errorMessages = de.queryAll(By.css('small.text-danger'));
      expect(errorMessages.length).toBeGreaterThan(0);

    });
  });

  describe('remove', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('it should call saveRemoveFieldUpdate on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(url, metadatum);
    });
  });

  describe('removeChangesFromField', () => {
    beforeEach(() => {
      comp.removeChangesFromField();
    });

    it('it should call removeChangesFromField on the objectUpdatesService with the correct url and uuid', () => {
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, metadatum.uuid);
    });
  });

  describe('findMetadataFieldSuggestions', () => {
    const query = 'query string';

    const metadataFieldSuggestions: InputSuggestion[] =
      [
        { displayValue: mdField1.toString().split('.').join('.&#8203;'), value: mdField1.toString() },
        { displayValue: mdField2.toString().split('.').join('.&#8203;'), value: mdField2.toString() },
        { displayValue: mdField3.toString().split('.').join('.&#8203;'), value: mdField3.toString() }
      ];

    beforeEach(() => {
      comp.findMetadataFieldSuggestions(query);

    });

    it('it should call queryMetadataFields on the metadataFieldService with the correct query', () => {

      expect(metadataFieldService.queryMetadataFields).toHaveBeenCalledWith(query);
    });

    it('it should set metadataFieldSuggestions to the right value', () => {
      const expected = 'a';
      scheduler.expectObservable(comp.metadataFieldSuggestions).toBe(expected, { a: metadataFieldSuggestions });
    });
  });

  describe('canSetEditable', () => {
    describe('when editable is currently true', () => {
      beforeEach(() => {
        comp.editable = observableOf(true);
      });

      it('canSetEditable should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: false });
      });
    });

    describe('when editable is currently false', () => {
      beforeEach(() => {
        comp.editable = observableOf(false);
      });

      describe('when the fieldUpdate\'s changeType is currently not REMOVE', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = FieldChangeType.ADD;
        });
        it('canSetEditable should return an observable emitting true', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: true });
        });
      });

      describe('when the fieldUpdate\'s changeType is currently REMOVE', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = FieldChangeType.REMOVE;
        });
        it('canSetEditable should return an observable emitting false', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canSetEditable()).toBe(expected, { a: false });
        });
      })
    });
  });

  describe('canSetUneditable', () => {
    describe('when editable is currently true', () => {
      beforeEach(() => {
        comp.editable = observableOf(true);
      });

      it('canSetUneditable should return an observable emitting true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetUneditable()).toBe(expected, { a: true });
      });
    });

    describe('when editable is currently false', () => {
      beforeEach(() => {
        comp.editable = observableOf(false);
      });

      it('canSetUneditable should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canSetUneditable()).toBe(expected, { a: false });
      });
    });
  });

  describe('when canSetEditable emits true', () => {
    beforeEach(() => {
      comp.editable = observableOf(false);
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
      comp.editable = observableOf(false);
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
      comp.editable = observableOf(true);
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
      comp.editable = observableOf(true);
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
      });
      it('canRemove should return an observable emitting true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canRemove()).toBe(expected, { a: true });
      });
    });

    describe('when the fieldUpdate\'s changeType is currently ADD', () => {
      beforeEach(() => {
        comp.fieldUpdate.changeType = FieldChangeType.ADD;
      });
      it('canRemove should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canRemove()).toBe(expected, { a: false });
      });
    })
  });

  describe('canUndo', () => {

    describe('when editable is currently true', () => {
      beforeEach(() => {
        comp.editable = observableOf(true);
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
        });

        it('canUndo should return an observable emitting true', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canUndo()).toBe(expected, { a: true });
        });
      });

      describe('when the fieldUpdate\'s changeType is currently undefined', () => {
        beforeEach(() => {
          comp.fieldUpdate.changeType = undefined;
        });

        it('canUndo should return an observable emitting false', () => {
          const expected = '(a|)';
          scheduler.expectObservable(comp.canUndo()).toBe(expected, { a: false });
        });
      });
    });

  });
});

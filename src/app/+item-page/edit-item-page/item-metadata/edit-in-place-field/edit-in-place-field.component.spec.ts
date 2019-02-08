import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { EditInPlaceFieldComponent } from './edit-in-place-field.component';
import { RegistryService } from '../../../../core/registry/registry.service';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { MetadataField } from '../../../../core/metadata/metadatafield.model';
import { By } from '@angular/platform-browser';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { getTestScheduler } from 'jasmine-marbles';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { TestScheduler } from 'rxjs/testing';
import { MetadataSchema } from '../../../../core/metadata/metadataschema.model';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';

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

const metadatum = Object.assign(new Metadatum(), {
  key: 'dc.description.abstract',
  value: 'Example abstract',
  language: 'en'
});

const route = 'http://test-url.com/test-url';
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
      queryMetadataFields: observableOf(new RemoteData(false, false, true, undefined, paginatedMetadataFields))
    });
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        saveChangeFieldUpdate: {},
        saveRemoveFieldUpdate: {},
        setEditableFieldUpdate: {},
        removeSingleFieldUpdate: {},
        isEditable: observableOf(false) // should always return something --> its in ngOnInit
      }
    );

    TestBed.configureTestingModule({
      imports: [FormsModule, SharedModule],
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
    de = fixture.debugElement.query(By.css('div.d-flex'));
    el = de.nativeElement;

    comp.route = route;
    comp.fieldUpdate = fieldUpdate;
    comp.metadata = metadatum;

    fixture.detectChanges();
  });

  describe('update', () => {
    beforeEach(() => {
      comp.update();
    });

    it('it should call saveChangeFieldUpdate on the objectUpdatesService with the correct route and metadata', () => {
      expect(objectUpdatesService.saveChangeFieldUpdate).toHaveBeenCalledWith(route, metadatum);
    });
  });

  describe('setEditable', () => {
    const editable = false;
    beforeEach(() => {
      comp.setEditable(editable);
    });

    it('it should call setEditableFieldUpdate on the objectUpdatesService with the correct route and uuid and false', () => {
      expect(objectUpdatesService.setEditableFieldUpdate).toHaveBeenCalledWith(route, metadatum.uuid, editable);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('it should call saveRemoveFieldUpdate on the objectUpdatesService with the correct route and metadata', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(route, metadatum);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('it should call saveRemoveFieldUpdate on the objectUpdatesService with the correct route and metadata', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(route, metadatum);
    });
  });

  describe('findMetadataFieldSuggestions', () => {
    const query = 'query string';

    const metadataFieldSuggestions: InputSuggestion[] =
      [
        { displayValue: mdField1.toString(), value: mdField1.toString() },
        { displayValue: mdField2.toString(), value: mdField2.toString() },
        { displayValue: mdField3.toString(), value: mdField3.toString() }
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

  describe('canRemove', () => {
    describe('when editable is currently true', () => {
      beforeEach(() => {
        comp.editable = observableOf(true);
      });
      it('canRemove should return an observable emitting false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.canRemove()).toBe(expected, { a: false });
      });
    });

    describe('when editable is currently false', () => {
      beforeEach(() => {
        comp.editable = observableOf(false);
      });

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
  });

  describe('canUndo', () => {

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

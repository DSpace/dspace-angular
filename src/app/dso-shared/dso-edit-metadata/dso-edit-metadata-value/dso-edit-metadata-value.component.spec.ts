import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MetadataField } from 'src/app/core/metadata/metadata-field.model';
import { MetadataSchema } from 'src/app/core/metadata/metadata-schema.model';
import { RegistryService } from 'src/app/core/registry/registry.service';
import { ConfidenceType } from 'src/app/core/shared/confidence-type';
import { Vocabulary } from 'src/app/core/submission/vocabularies/models/vocabulary.model';
import { VocabularyService } from 'src/app/core/submission/vocabularies/vocabulary.service';
import { DynamicOneboxModel } from 'src/app/shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DynamicScrollableDropdownModel } from 'src/app/shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';
import { VocabularyServiceStub } from 'src/app/shared/testing/vocabulary-service.stub';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import {
  MetadataValue,
  VIRTUAL_METADATA_PREFIX,
} from '../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { DsDynamicOneboxComponent } from '../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.component';
import { DsDynamicScrollableDropdownComponent } from '../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { ThemedTypeBadgeComponent } from '../../../shared/object-collection/shared/badges/type-badge/themed-type-badge.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { VarDirective } from '../../../shared/utils/var.directive';
import {
  DsoEditMetadataChangeType,
  DsoEditMetadataValue,
} from '../dso-edit-metadata-form';
import { DsoEditMetadataValueComponent } from './dso-edit-metadata-value.component';

const EDIT_BTN = 'edit';
const CONFIRM_BTN = 'confirm';
const REMOVE_BTN = 'remove';
const UNDO_BTN = 'undo';
const DRAG_BTN = 'drag';

describe('DsoEditMetadataValueComponent', () => {
  let component: DsoEditMetadataValueComponent;
  let fixture: ComponentFixture<DsoEditMetadataValueComponent>;

  let relationshipService: RelationshipDataService;
  let dsoNameService: DSONameService;
  let vocabularyServiceStub: any;
  let itemService: ItemDataService;
  let registryService: RegistryService;
  let notificationsService: NotificationsService;

  let editMetadataValue: DsoEditMetadataValue;
  let metadataValue: MetadataValue;
  let dso: DSpaceObject;

  const collection =  Object.assign(new Collection(), {
    uuid: 'fake-uuid',
  });

  const item = Object.assign(new Item(), {
    _links: {
      self: { href: 'fake-item-url/item' },
    },
    id: 'item',
    uuid: 'item',
    owningCollection: createSuccessfulRemoteDataObject$(collection),
  });

  const mockVocabularyScrollable: Vocabulary = {
    id: 'scrollable',
    name: 'scrollable',
    scrollable: true,
    hierarchical: false,
    preloadLevel: 0,
    type: 'vocabulary',
    _links: {
      self: {
        href: 'self',
      },
      entries: {
        href: 'entries',
      },
    },
  };

  const mockVocabularyHierarchical: Vocabulary = {
    id: 'hierarchical',
    name: 'hierarchical',
    scrollable: false,
    hierarchical: true,
    preloadLevel: 2,
    type: 'vocabulary',
    _links: {
      self: {
        href: 'self',
      },
      entries: {
        href: 'entries',
      },
    },
  };

  const mockVocabularySuggester: Vocabulary = {
    id: 'suggester',
    name: 'suggester',
    scrollable: false,
    hierarchical: false,
    preloadLevel: 0,
    type: 'vocabulary',
    _links: {
      self: {
        href: 'self',
      },
      entries: {
        href: 'entries',
      },
    },
  };

  let metadataSchema: MetadataSchema;
  let metadataFields: MetadataField[];

  function initServices(): void {
    metadataSchema = Object.assign(new MetadataSchema(), {
      id: 0,
      prefix: 'metadata',
      namespace: 'http://example.com/',
    });
    metadataFields = [
      Object.assign(new MetadataField(), {
        id: 0,
        element: 'regular',
        qualifier: null,
        schema: createSuccessfulRemoteDataObject$(metadataSchema),
      }),
    ];

    relationshipService = jasmine.createSpyObj('relationshipService', {
      resolveMetadataRepresentation: of(
        new ItemMetadataRepresentation(metadataValue),
      ),
    });
    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Related Name',
    });
    itemService = jasmine.createSpyObj('itemService', {
      findByHref: createSuccessfulRemoteDataObject$(item),
    });
    vocabularyServiceStub = new VocabularyServiceStub();
    registryService = jasmine.createSpyObj('registryService', {
      queryMetadataFields: createSuccessfulRemoteDataObject$(createPaginatedList(metadataFields)),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error', 'success']);
  }

  beforeEach(waitForAsync(async () => {
    metadataValue = Object.assign(new MetadataValue(), {
      value: 'Regular Name',
      language: 'en',
      place: 0,
      authority: undefined,
    });
    editMetadataValue = new DsoEditMetadataValue(metadataValue);
    dso = Object.assign(new DSpaceObject(), {
      _links: {
        self: { href: 'fake-dso-url/dso' },
      },
    });

    initServices();

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        DsoEditMetadataValueComponent,
        VarDirective,
      ],
      providers: [
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: ItemDataService, useValue: itemService },
        { provide: RegistryService, useValue: registryService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsoEditMetadataValueComponent, {
        remove: {
          imports: [DsDynamicOneboxComponent, DsDynamicScrollableDropdownComponent, ThemedTypeBadgeComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoEditMetadataValueComponent);
    component = fixture.componentInstance;
    component.mdValue = editMetadataValue;
    component.dso = dso;
    component.saving$ = of(false);
    fixture.detectChanges();
  });

  it('should not show a badge', () => {
    expect(
      fixture.debugElement.query(By.css('ds-type-badge')),
    ).toBeNull();
  });

  describe('when no changes have been made', () => {
    assertButton(EDIT_BTN, true, false);
    assertButton(CONFIRM_BTN, false);
    assertButton(REMOVE_BTN, true, false);
    assertButton(UNDO_BTN, true, true);
    assertButton(DRAG_BTN, true, false);
  });

  describe('when this is the only metadata value within its field', () => {
    beforeEach(() => {
      component.isOnlyValue = true;
      fixture.detectChanges();
    });

    assertButton(DRAG_BTN, true, true);
  });

  describe('when the value is marked for removal', () => {
    beforeEach(() => {
      editMetadataValue.change = DsoEditMetadataChangeType.REMOVE;
      fixture.detectChanges();
    });

    assertButton(REMOVE_BTN, true, true);
    assertButton(UNDO_BTN, true, false);
  });

  describe('when the value is being edited', () => {
    beforeEach(() => {
      editMetadataValue.editing = true;
      fixture.detectChanges();
    });

    assertButton(EDIT_BTN, false);
    assertButton(CONFIRM_BTN, true, false);
    assertButton(UNDO_BTN, true, false);
  });

  describe('when the value is new', () => {
    beforeEach(() => {
      editMetadataValue.change = DsoEditMetadataChangeType.ADD;
      fixture.detectChanges();
    });

    assertButton(REMOVE_BTN, true, false);
    assertButton(UNDO_BTN, true, false);
  });

  describe('when the metadata value is virtual', () => {
    beforeEach(() => {
      metadataValue = Object.assign(new MetadataValue(), {
        value: 'Virtual Name',
        language: 'en',
        place: 0,
        authority: `${VIRTUAL_METADATA_PREFIX}authority-key`,
      });
      editMetadataValue = new DsoEditMetadataValue(metadataValue);
      component.mdValue = editMetadataValue;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show a badge', () => {
      expect(
        fixture.debugElement.query(By.css('ds-type-badge')),
      ).toBeTruthy();
    });

    assertButton(EDIT_BTN, true, true);
    assertButton(CONFIRM_BTN, false);
    assertButton(REMOVE_BTN, true, true);
    assertButton(UNDO_BTN, true, true);
    assertButton(DRAG_BTN, true, false);
  });

  describe('when the metadata field not uses a vocabulary and is editing', () => {
    beforeEach(waitForAsync(() => {
      spyOn(vocabularyServiceStub, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(null, 204));
      metadataValue = Object.assign(new MetadataValue(), {
        value: 'Regular value',
        language: 'en',
        place: 0,
        authority: null,
      });
      editMetadataValue = new DsoEditMetadataValue(metadataValue);
      editMetadataValue.editing = true;
      component.mdValue = editMetadataValue;
      component.mdField = 'metadata.regular';
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('should render a textarea', () => {
      expect(vocabularyServiceStub.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
    });
  });

  describe('when the metadata field uses a scrollable vocabulary and is editing', () => {
    beforeEach(waitForAsync(() => {
      spyOn(vocabularyServiceStub, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularyScrollable));
      metadataValue = Object.assign(new MetadataValue(), {
        value: 'Authority Controlled value',
        language: 'en',
        place: 0,
        authority: null,
      });
      editMetadataValue = new DsoEditMetadataValue(metadataValue);
      editMetadataValue.editing = true;
      component.mdValue = editMetadataValue;
      component.mdField = 'metadata.scrollable';
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('should render the DsDynamicScrollableDropdownComponent', () => {
      expect(vocabularyServiceStub.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('ds-dynamic-scrollable-dropdown'))).toBeTruthy();
    });

    it('getModel should return a DynamicScrollableDropdownModel', () => {
      const model = component.getModel();

      expect(model instanceof DynamicScrollableDropdownModel).toBe(true);
      expect(model.vocabularyOptions.name).toBe(mockVocabularyScrollable.name);

    });
  });

  describe('when the  metadata field uses a hierarchical vocabulary and is editing', () => {
    beforeEach(waitForAsync(() => {
      spyOn(vocabularyServiceStub, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularyHierarchical));
      metadataValue = Object.assign(new MetadataValue(), {
        value: 'Authority Controlled value',
        language: 'en',
        place: 0,
        authority: null,
      });
      editMetadataValue = new DsoEditMetadataValue(metadataValue);
      editMetadataValue.editing = true;
      component.mdValue = editMetadataValue;
      component.mdField = 'metadata.hierarchical';
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('should render the DsDynamicOneboxComponent', () => {
      expect(vocabularyServiceStub.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('ds-dynamic-onebox'))).toBeTruthy();
    });

    it('getModel should return a DynamicOneboxModel', () => {
      const model = component.getModel();

      expect(model instanceof DynamicOneboxModel).toBe(true);
      expect(model.vocabularyOptions.name).toBe(mockVocabularyHierarchical.name);
    });
  });

  describe('when the metadata field uses a suggester vocabulary and is editing', () => {
    beforeEach(waitForAsync(() => {
      spyOn(vocabularyServiceStub, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularySuggester));
      spyOn(component.confirm, 'emit');
      metadataValue = Object.assign(new MetadataValue(), {
        value: 'Authority Controlled value',
        language: 'en',
        place: 0,
        authority: 'authority-key',
        confidence: ConfidenceType.CF_UNCERTAIN,
      });
      editMetadataValue = new DsoEditMetadataValue(metadataValue);
      editMetadataValue.editing = true;
      component.mdValue = editMetadataValue;
      component.mdField = 'metadata.suggester';
      component.ngOnInit();
      fixture.detectChanges();
    }));

    it('should render the DsDynamicOneboxComponent', () => {
      expect(vocabularyServiceStub.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('ds-dynamic-onebox'))).toBeTruthy();
    });

    it('getModel should return a DynamicOneboxModel', () => {
      const model = component.getModel();

      expect(model instanceof DynamicOneboxModel).toBe(true);
      expect(model.vocabularyOptions.name).toBe(mockVocabularySuggester.name);
    });

    describe('authority key edition', () => {

      it('should update confidence to CF_NOVALUE when authority is cleared', () => {
        component.mdValue.newValue.authority = '';

        component.onChangeAuthorityKey();

        expect(component.mdValue.newValue.confidence).toBe(ConfidenceType.CF_NOVALUE);
        expect(component.confirm.emit).toHaveBeenCalledWith(false);
      });

      it('should update confidence to CF_ACCEPTED when authority key is edited', () => {
        component.mdValue.newValue.authority = 'newAuthority';
        component.mdValue.originalValue.authority = 'oldAuthority';

        component.onChangeAuthorityKey();

        expect(component.mdValue.newValue.confidence).toBe(ConfidenceType.CF_ACCEPTED);
        expect(component.confirm.emit).toHaveBeenCalledWith(false);
      });

      it('should not update confidence when authority key remains the same', () => {
        component.mdValue.newValue.authority = 'sameAuthority';
        component.mdValue.originalValue.authority = 'sameAuthority';

        component.onChangeAuthorityKey();

        expect(component.mdValue.newValue.confidence).toBe(ConfidenceType.CF_UNCERTAIN);
        expect(component.confirm.emit).not.toHaveBeenCalled();
      });

      it('should call onChangeEditingAuthorityStatus with true when clicking the lock button', () => {
        spyOn(component, 'onChangeEditingAuthorityStatus');
        const lockButton = fixture.nativeElement.querySelector('#metadata-confirm-btn');

        lockButton.click();

        expect(component.onChangeEditingAuthorityStatus).toHaveBeenCalledWith(true);
      });

      it('should disable the input when editingAuthority is false', (done) => {
        component.editingAuthority = false;

        fixture.detectChanges();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const inputElement = fixture.nativeElement.querySelector('input[data-test="authority-input"]');
          expect(inputElement.disabled).toBeTruthy();
          done();
        });
      });

      it('should enable the input when editingAuthority is true', (done) => {
        component.editingAuthority = true;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const inputElement = fixture.nativeElement.querySelector('input[data-test="authority-input"]');
          expect(inputElement.disabled).toBeFalsy();
          done();
        });


      });

      it('should update mdValue.newValue properties when authority is present', () => {
        const event = {
          value: 'Some value',
          authority: 'Some authority',
        };

        component.onChangeAuthorityField(event);

        expect(component.mdValue.newValue.value).toBe(event.value);
        expect(component.mdValue.newValue.authority).toBe(event.authority);
        expect(component.mdValue.newValue.confidence).toBe(ConfidenceType.CF_ACCEPTED);
        expect(component.confirm.emit).toHaveBeenCalledWith(false);
      });

      it('should update mdValue.newValue properties when authority is not present', () => {
        const event = {
          value: 'Some value',
          authority: null,
        };

        component.onChangeAuthorityField(event);

        expect(component.mdValue.newValue.value).toBe(event.value);
        expect(component.mdValue.newValue.authority).toBeNull();
        expect(component.mdValue.newValue.confidence).toBe(ConfidenceType.CF_UNSET);
        expect(component.confirm.emit).toHaveBeenCalledWith(false);
      });

    });

  });

  function assertButton(name: string, exists: boolean, disabled: boolean = false): void {
    describe(`${name} button`, () => {
      let btn: DebugElement;

      beforeEach(() => {
        btn = fixture.debugElement.query(By.css(`button[data-test="metadata-${name}-btn"]`));
      });

      if (exists) {
        it('should exist', () => {
          expect(btn).toBeTruthy();
        });

        it(`should${disabled ? ' ' : ' not '}be disabled`, () => {
          expect(btn.nativeElement.disabled).toBe(disabled);
        });
      } else {
        it('should not exist', () => {
          expect(btn).toBeNull();
        });
      }
    });
  }
});

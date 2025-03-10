import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ItemDataService } from '../../../../core/data/item-data.service';
import { MetadataField } from '../../../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../../../core/metadata/metadata-schema.model';
import { RegistryService } from '../../../../core/registry/registry.service';
import { Collection } from '../../../../core/shared/collection.model';
import { ConfidenceType } from '../../../../core/shared/confidence-type';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { Vocabulary } from '../../../../core/submission/vocabularies/models/vocabulary.model';
import { VocabularyService } from '../../../../core/submission/vocabularies/vocabulary.service';
import { DynamicOneboxModel } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DsDynamicScrollableDropdownComponent } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DynamicScrollableDropdownModel } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { VocabularyServiceStub } from '../../../../shared/testing/vocabulary-service.stub';
import { DsoEditMetadataValue } from '../../dso-edit-metadata-form';
import { DsoEditMetadataAuthorityFieldComponent } from './dso-edit-metadata-authority-field.component';

describe('DsoEditMetadataAuthorityFieldComponent', () => {
  let component: DsoEditMetadataAuthorityFieldComponent;
  let fixture: ComponentFixture<DsoEditMetadataAuthorityFieldComponent>;

  let vocabularyService: any;
  let itemService: ItemDataService;
  let registryService: RegistryService;
  let notificationsService: NotificationsService;

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

  let editMetadataValue: DsoEditMetadataValue;
  let metadataValue: MetadataValue;
  let metadataSchema: MetadataSchema;
  let metadataFields: MetadataField[];

  beforeEach(async () => {
    itemService = jasmine.createSpyObj('itemService', {
      findByHref: createSuccessfulRemoteDataObject$(item),
    });
    vocabularyService = new VocabularyServiceStub();
    registryService = jasmine.createSpyObj('registryService', {
      queryMetadataFields: createSuccessfulRemoteDataObject$(createPaginatedList(metadataFields)),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error', 'success']);

    metadataValue = Object.assign(new MetadataValue(), {
      value: 'Regular Name',
      language: 'en',
      place: 0,
      authority: undefined,
    });
    editMetadataValue = new DsoEditMetadataValue(metadataValue);
    metadataSchema = Object.assign(new MetadataSchema(), {
      id: 0,
      prefix: 'metadata',
      namespace: 'https://example.com/',
    });
    metadataFields = [
      Object.assign(new MetadataField(), {
        id: 0,
        element: 'regular',
        qualifier: null,
        schema: createSuccessfulRemoteDataObject$(metadataSchema),
      }),
    ];
    dso = Object.assign(new DSpaceObject(), {
      _links: {
        self: { href: 'fake-dso-url/dso' },
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        DsoEditMetadataAuthorityFieldComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: ItemDataService, useValue: itemService },
        { provide: RegistryService, useValue: registryService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).overrideComponent(DsoEditMetadataAuthorityFieldComponent, {
      remove: {
        imports: [
          DsDynamicScrollableDropdownComponent,
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DsoEditMetadataAuthorityFieldComponent);
    component = fixture.componentInstance;
    component.mdValue = editMetadataValue;
    component.dso = dso;
    fixture.detectChanges();
  });

  describe('when the metadata field uses a scrollable vocabulary and is editing', () => {
    beforeEach(waitForAsync(() => {
      spyOn(vocabularyService, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularyScrollable));
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
      expect(vocabularyService.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
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
      spyOn(vocabularyService, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularyHierarchical));
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
      expect(vocabularyService.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
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
      spyOn(vocabularyService, 'getVocabularyByMetadataAndCollection').and.returnValue(createSuccessfulRemoteDataObject$(mockVocabularySuggester));
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
      expect(vocabularyService.getVocabularyByMetadataAndCollection).toHaveBeenCalled();
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
});

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
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RelationshipDataService } from '@dspace/core/data/relationship-data.service';
import { MetadataField } from '@dspace/core/metadata/metadata-field.model';
import { MetadataSchema } from '@dspace/core/metadata/metadata-schema.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  MetadataValue,
  VIRTUAL_METADATA_PREFIX,
} from '@dspace/core/shared/metadata.models';
import { ItemMetadataRepresentation } from '@dspace/core/shared/metadata-representation/item/item-metadata-representation.model';
import { DsoEditMetadataFieldServiceStub } from '@dspace/core/testing/dso-edit-metadata-field.service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RegistryService } from 'src/app/admin/admin-registries/registry/registry.service';
import { mockSecurityConfig } from 'src/app/submission/utils/submission.mock';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ThemedTypeBadgeComponent } from '../../../shared/object-collection/shared/badges/type-badge/themed-type-badge.component';
import { VarDirective } from '../../../shared/utils/var.directive';
import {
  DsoEditMetadataChangeType,
  DsoEditMetadataValue,
} from '../dso-edit-metadata-form';
import { DsoEditMetadataFieldService } from '../dso-edit-metadata-value-field/dso-edit-metadata-field.service';
import { DsoEditMetadataValueFieldLoaderComponent } from '../dso-edit-metadata-value-field/dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field-loader.component';
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
  let dsoEditMetadataFieldService: DsoEditMetadataFieldServiceStub;
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

  let metadataSchema: MetadataSchema;
  let metadataFields: MetadataField[];

  function initServices(): void {
    relationshipService = jasmine.createSpyObj('relationshipService', {
      resolveMetadataRepresentation: of(
        new ItemMetadataRepresentation(metadataValue),
      ),
    });
    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Related Name',
    });
    dsoEditMetadataFieldService = new DsoEditMetadataFieldServiceStub();
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
        BtnDisabledDirective,
      ],
      providers: [
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: DsoEditMetadataFieldService, useValue: dsoEditMetadataFieldService },
        { provide: RegistryService, useValue: registryService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsoEditMetadataValueComponent, {
        remove: {
          imports: [
            ThemedTypeBadgeComponent,
            DsoEditMetadataValueFieldLoaderComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoEditMetadataValueComponent);
    component = fixture.componentInstance;
    component.mdValue = editMetadataValue;
    component.dso = dso;
    component.metadataSecurityConfiguration = mockSecurityConfig;
    component.mdField = 'person.birthDate';
    component.saving$ = of(false);
    spyOn(component, 'initSecurityLevel').and.callThrough();
    fixture.detectChanges();
  });

  it('should not show a badge', () => {
    expect(
      fixture.debugElement.query(By.css('ds-type-badge')),
    ).toBeNull();
  });

  it('should call initSecurityLevel on init', () => {
    expect(fixture.debugElement.query(By.css('ds-type-badge'))).toBeNull();
    expect(component.initSecurityLevel).toHaveBeenCalled();
    expect(component.mdSecurityConfigLevel$.value).toEqual([0, 1]);
  });

  it('should call initSecurityLevel when field changes', () => {
    component.mdField = 'test';
    expect(component.initSecurityLevel).toHaveBeenCalled();
    expect(component.mdSecurityConfigLevel$.value).toEqual([0, 1, 2]);
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
          if (disabled) {
            expect(btn.nativeElement.getAttribute('aria-disabled')).toBe('true');
            expect(btn.nativeElement.classList.contains('disabled')).toBeTrue();
          } else {
            // Can be null or false, depending on if button was ever disabled so just check not true
            expect(btn.nativeElement.getAttribute('aria-disabled')).not.toBe('true');
            expect(btn.nativeElement.classList.contains('disabled')).toBeFalse();
          }
        });
      } else {
        it('should not exist', () => {
          expect(btn).toBeNull();
        });
      }
    });
  }
});

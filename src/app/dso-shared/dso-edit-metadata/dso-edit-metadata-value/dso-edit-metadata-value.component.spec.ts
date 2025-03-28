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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import {
  MetadataValue,
  VIRTUAL_METADATA_PREFIX,
} from '../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ThemedTypeBadgeComponent } from '../../../shared/object-collection/shared/badges/type-badge/themed-type-badge.component';
import { DsoEditMetadataFieldServiceStub } from '../../../shared/testing/dso-edit-metadata-field.service.stub';
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

  let editMetadataValue: DsoEditMetadataValue;
  let metadataValue: MetadataValue;

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
  }

  beforeEach(waitForAsync(async () => {
    metadataValue = Object.assign(new MetadataValue(), {
      value: 'Regular Name',
      language: 'en',
      place: 0,
      authority: undefined,
    });
    editMetadataValue = new DsoEditMetadataValue(metadataValue);

    initServices();

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        DsoEditMetadataValueComponent,
        VarDirective,
        BtnDisabledDirective,
      ],
      providers: [
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: DsoEditMetadataFieldService, useValue: dsoEditMetadataFieldService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsoEditMetadataValueComponent, {
        remove: {
          imports: [
            DsoEditMetadataValueFieldLoaderComponent,
            ThemedTypeBadgeComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoEditMetadataValueComponent);
    component = fixture.componentInstance;
    component.mdValue = editMetadataValue;
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

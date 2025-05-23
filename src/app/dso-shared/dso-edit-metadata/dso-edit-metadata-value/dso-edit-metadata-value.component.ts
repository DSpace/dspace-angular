import {
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { Context } from '../../../core/shared/context.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import {
  MetadataRepresentation,
  MetadataRepresentationType,
} from '../../../core/shared/metadata-representation/metadata-representation.model';
import { Vocabulary } from '../../../core/submission/vocabularies/models/vocabulary.model';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { hasValue } from '../../../shared/empty.util';
import { AuthorityConfidenceStateDirective } from '../../../shared/form/directives/authority-confidence-state.directive';
import { ThemedTypeBadgeComponent } from '../../../shared/object-collection/shared/badges/type-badge/themed-type-badge.component';
import { DebounceDirective } from '../../../shared/utils/debounce.directive';
import {
  DsoEditMetadataChangeType,
  DsoEditMetadataValue,
} from '../dso-edit-metadata-form';
import { DsoEditMetadataFieldService } from '../dso-edit-metadata-value-field/dso-edit-metadata-field.service';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-value-field/dso-edit-metadata-field-type.enum';
import { DsoEditMetadataValueFieldLoaderComponent } from '../dso-edit-metadata-value-field/dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field-loader.component';

@Component({
  selector: 'ds-dso-edit-metadata-value',
  styleUrls: ['./dso-edit-metadata-value.component.scss', '../dso-edit-metadata-shared/dso-edit-metadata-cells.scss'],
  templateUrl: './dso-edit-metadata-value.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    AuthorityConfidenceStateDirective,
    BtnDisabledDirective,
    CdkDrag,
    CdkDragHandle,
    DebounceDirective,
    DsoEditMetadataValueFieldLoaderComponent,
    FormsModule,
    NgbTooltipModule,
    NgClass,
    RouterLink,
    ThemedTypeBadgeComponent,
    TranslateModule,
  ],
})
/**
 * Component displaying a single editable row for a metadata value
 */
export class DsoEditMetadataValueComponent implements OnInit, OnChanges {

  @Input() context: Context;

  /**
   * The parent {@link DSpaceObject} to display a metadata form for
   * Also used to determine metadata-representations in case of virtual metadata
   */
  @Input() dso: DSpaceObject;

  /**
   * The metadata field that is being edited
   */
  @Input() mdField: string;

  /**
   * Editable metadata value to show
   */
  @Input() mdValue: DsoEditMetadataValue;

  /**
   * Type of DSO we're displaying values for
   * Determines i18n messages
   */
  @Input() dsoType: string;

  /**
   * Observable to check if the form is being saved or not
   * Will disable certain functionality while saving
   */
  @Input() saving$: Observable<boolean>;

  /**
   * Is this value the only one within its list?
   * Will disable certain functionality like dragging (because dragging within a list of 1 is pointless)
   */
  @Input() isOnlyValue = false;

  /**
   * Emits when the user clicked edit
   */
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits when the user clicked confirm
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Emits when the user clicked remove
   */
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits when the user clicked undo
   */
  @Output() undo: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits true when the user starts dragging a value, false when the user stops dragging
   */
  @Output() dragging: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * The DsoEditMetadataChangeType enumeration for access in the component's template
   * @type {DsoEditMetadataChangeType}
   */
  public DsoEditMetadataChangeTypeEnum = DsoEditMetadataChangeType;

  /**
   * The item this metadata value represents in case it's virtual (if any, otherwise null)
   */
  mdRepresentation$: Observable<ItemMetadataRepresentation | null>;

  /**
   * The route to the item represented by this virtual metadata value (otherwise null)
   */
  mdRepresentationItemRoute$: Observable<string | null>;

  /**
   * The name of the item represented by this virtual metadata value (otherwise null)
   */
  mdRepresentationName$: Observable<string | null>;

  /**
   * The type of edit field that should be displayed
   */
  fieldType$: Observable<EditMetadataValueFieldType>;

  readonly ConfidenceTypeEnum = ConfidenceType;

  constructor(
    protected relationshipService: RelationshipDataService,
    protected dsoNameService: DSONameService,
    protected metadataService: MetadataService,
    protected dsoEditMetadataFieldService: DsoEditMetadataFieldService,
  ) {
  }

  ngOnInit(): void {
    this.initVirtualProperties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mdField) {
      this.fieldType$ = this.getFieldType();
    }
  }

  /**
   * Initialise potential properties of a virtual metadata value
   */
  initVirtualProperties(): void {
    this.mdRepresentation$ = this.metadataService.isVirtual(this.mdValue.newValue) ?
      this.relationshipService.resolveMetadataRepresentation(this.mdValue.newValue, this.dso, 'Item')
        .pipe(
          map((mdRepresentation: MetadataRepresentation) =>
            mdRepresentation.representationType === MetadataRepresentationType.Item ? mdRepresentation as ItemMetadataRepresentation : null,
          ),
        ) : EMPTY;
    this.mdRepresentationItemRoute$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? getItemPageRoute(mdRepresentation) : null),
    );
    this.mdRepresentationName$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? this.dsoNameService.getName(mdRepresentation) : null),
    );
  }

  /**
   * Retrieves the {@link EditMetadataValueFieldType} to be displayed for the current field while in edit mode.
   */
  getFieldType(): Observable<EditMetadataValueFieldType> {
    return this.dsoEditMetadataFieldService.findDsoFieldVocabulary(this.dso, this.mdField).pipe(
      map((vocabulary: Vocabulary) => {
        if (hasValue(vocabulary)) {
          return EditMetadataValueFieldType.AUTHORITY;
        }
        if (this.mdField === 'dspace.entity.type') {
          return EditMetadataValueFieldType.ENTITY_TYPE;
        }
        return EditMetadataValueFieldType.PLAIN_TEXT;
      }),
    );
  }

}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DsoEditMetadataChangeType, DsoEditMetadataValue } from '../dso-edit-metadata-form';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import {
  MetadataRepresentation,
  MetadataRepresentationType
} from '../../../core/shared/metadata-representation/metadata-representation.model';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import {
  ItemMetadataRepresentation
} from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { map } from 'rxjs/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { MetadataSecurityConfiguration } from '../../../core/submission/models/metadata-security-configuration';

@Component({
  selector: 'ds-dso-edit-metadata-value',
  styleUrls: ['./dso-edit-metadata-value.component.scss', '../dso-edit-metadata-shared/dso-edit-metadata-cells.scss'],
  templateUrl: './dso-edit-metadata-value.component.html',
})
/**
 * Component displaying a single editable row for a metadata value
 */
export class DsoEditMetadataValueComponent implements OnInit, OnChanges {
  /**
   * The parent {@link DSpaceObject} to display a metadata form for
   * Also used to determine metadata-representations in case of virtual metadata
   */
  @Input() dso: DSpaceObject;

  /**
   * Editable metadata value to show
   */
  @Input() mdValue: DsoEditMetadataValue;

  /**
   * The metadata security configuration for the entity.
   */
  @Input() metadataSecurityConfiguration: MetadataSecurityConfiguration;

  /**
   * The metadata field to display a value for
   */
  @Input() mdField: string;

  /**
   * Flag whether this is a new metadata field or exists already
   */
  @Input() isNewMdField = false;

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
   * Emits the new value of security level
   */
  @Output() updateSecurityLevel: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Emits true when the metadata has security settings
   */
  @Output() hasSecurityLevel: EventEmitter<boolean> = new EventEmitter<boolean>(false);

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
  mdSecurityConfigLevel$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(protected relationshipService: RelationshipDataService,
              protected dsoNameService: DSONameService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mdField) {
      this.initSecurityLevel();
    }
  }

  ngOnInit(): void {
    this.initVirtualProperties();
    this.initSecurityLevel();
  }

  initSecurityLevel(): void {
    let appliedSecurity: number[] = [];
    if (this.metadataSecurityConfiguration && this.metadataSecurityConfiguration?.metadataCustomSecurity[this.mdField]) {
      appliedSecurity = this.metadataSecurityConfiguration.metadataCustomSecurity[this.mdField];
    } else if (this.metadataSecurityConfiguration && this.metadataSecurityConfiguration?.metadataSecurityDefault){
      appliedSecurity = this.metadataSecurityConfiguration.metadataSecurityDefault;
    }
    this.mdSecurityConfigLevel$.next(appliedSecurity);
  }

  /**
   * Initialise potential properties of a virtual metadata value
   */
  initVirtualProperties(): void {
    this.mdRepresentation$ = this.mdValue.newValue.isVirtual ?
      this.relationshipService.resolveMetadataRepresentation(this.mdValue.newValue, this.dso, 'Item')
        .pipe(
          map((mdRepresentation: MetadataRepresentation) =>
            mdRepresentation.representationType === MetadataRepresentationType.Item ? mdRepresentation as ItemMetadataRepresentation : null
          )
        ) : EMPTY;
    this.mdRepresentationItemRoute$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? getItemPageRoute(mdRepresentation) : null),
    );
    this.mdRepresentationName$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? this.dsoNameService.getName(mdRepresentation) : null),
    );
  }

  /**
   * Emits the edit event
   * @param securityLevel
   */
  changeSelectedSecurity(securityLevel: number) {
    this.updateSecurityLevel.emit(securityLevel);
  }

  /**
   * Emits the value for the metadata security existence
   */
  hasSecurityMetadata(event: boolean) {
    this.hasSecurityLevel.emit(event);
  }
}

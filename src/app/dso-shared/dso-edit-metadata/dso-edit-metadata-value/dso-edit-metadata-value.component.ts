import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DsoEditMetadataChangeType, DsoEditMetadataValue } from '../dso-edit-metadata-form';
import { Observable } from 'rxjs/internal/Observable';
import { MetadataRepresentationType } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { RelationshipService } from '../../../core/data/relationship.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { of } from 'rxjs/internal/observable/of';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { map } from 'rxjs/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-dso-edit-metadata-value',
  styleUrls: ['./dso-edit-metadata-value.component.scss', '../dso-edit-metadata-shared/dso-edit-metadata-cells.scss'],
  templateUrl: './dso-edit-metadata-value.component.html',
})
/**
 * Component displaying a single editable row for a metadata value
 */
export class DsoEditMetadataValueComponent implements OnInit {
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

  constructor(protected relationshipService: RelationshipService,
              protected dsoNameService: DSONameService) {
  }

  ngOnInit(): void {
    this.initVirtualProperties();
  }

  /**
   * Initialise potential properties of a virtual metadata value
   */
  initVirtualProperties() {
    this.mdRepresentation$ = this.mdValue.newValue.isVirtual ?
      this.relationshipService.resolveMetadataRepresentation(this.mdValue.newValue, this.dso, 'Item')
        .pipe(map((mdRepresentation) => mdRepresentation.representationType === MetadataRepresentationType.Item ? mdRepresentation : null)) : of(null);
    this.mdRepresentationItemRoute$ = this.mdRepresentation$.pipe(
      map((mdRepresentation) => mdRepresentation ? getItemPageRoute(mdRepresentation) : null),
    );
    this.mdRepresentationName$ = this.mdRepresentation$.pipe(
      map((mdRepresentation) => mdRepresentation ? this.dsoNameService.getName(mdRepresentation) : null),
    );
  }
}

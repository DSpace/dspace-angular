import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DsoEditMetadataChangeType, DsoEditMetadataValue } from '../dso-edit-metadata-form';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  Observable,
  shareReplay,
  Subscription
} from 'rxjs';
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
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-dso-edit-metadata-value',
  styleUrls: ['./dso-edit-metadata-value.component.scss', '../dso-edit-metadata-shared/dso-edit-metadata-cells.scss'],
  templateUrl: './dso-edit-metadata-value.component.html',
})
/**
 * Component displaying a single editable row for a metadata value
 */
export class DsoEditMetadataValueComponent implements OnInit, OnDestroy {
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
  @Input()
  set metadataSecurityConfiguration(metadataSecurityConfiguration: MetadataSecurityConfiguration) {
    this._metadataSecurityConfiguration$.next(metadataSecurityConfiguration);
  }

  get metadataSecurityConfiguration() {
    return this._metadataSecurityConfiguration$.value;
  }

  protected readonly _metadataSecurityConfiguration$ =
      new BehaviorSubject<MetadataSecurityConfiguration | null>(null);

  /**
   * The metadata field to display a value for
   */
  @Input()
  set mdField(mdField: string) {
    this._mdField$.next(mdField);
  }

  get mdField() {
    return this._mdField$.value;
  }

  protected readonly _mdField$ = new BehaviorSubject<string | null>(null);

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
  readonly mdSecurityConfigLevel$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  canShowMetadataSecurity$: Observable<boolean>;

  private sub: Subscription;

  constructor(protected relationshipService: RelationshipDataService,
              protected dsoNameService: DSONameService) {
  }

  ngOnInit(): void {
    this.initVirtualProperties();

    this.sub = combineLatest([
      this._mdField$,
      this._metadataSecurityConfiguration$
    ]).subscribe(([mdField, metadataSecurityConfig]) => this.initSecurityLevel(mdField, metadataSecurityConfig));

    this.canShowMetadataSecurity$ =
        combineLatest([
          this._mdField$.pipe(distinctUntilChanged()),
          this.mdSecurityConfigLevel$
        ]).pipe(
            map(([mdField, securityConfigLevel]) => hasValue(mdField) && this.hasSecurityChoice(securityConfigLevel)),
            shareReplay(1),
        );
  }

  private hasSecurityChoice(securityConfigLevel: number[]) {
    return securityConfigLevel?.length > 1;
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  initSecurityLevel(mdField: string, metadataSecurityConfig: MetadataSecurityConfiguration) {
    let appliedSecurity: number[] = [];
    if (hasValue(metadataSecurityConfig)) {
      if (metadataSecurityConfig?.metadataCustomSecurity[mdField]) {
        appliedSecurity = metadataSecurityConfig.metadataCustomSecurity[mdField];
      } else if (metadataSecurityConfig?.metadataSecurityDefault) {
        appliedSecurity = metadataSecurityConfig.metadataSecurityDefault;
      }
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

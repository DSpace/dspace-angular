import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DsoEditMetadataChangeType, DsoEditMetadataValue } from '../dso-edit-metadata-form';
import { Observable } from 'rxjs/internal/Observable';
import {
  MetadataRepresentation,
  MetadataRepresentationType
} from '../../../core/shared/metadata-representation/metadata-representation.model';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { map, switchMap } from 'rxjs/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { VocabularyService } from 'src/app/core/submission/vocabularies/vocabulary.service';
import { Vocabulary } from '../../../core/submission/vocabularies/models/vocabulary.model';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { getFirstSucceededRemoteData, getFirstSucceededRemoteDataPayload, getRemoteDataPayload } from '../../../core/shared/operators';
import { DsDynamicOneboxModelConfig, DynamicOneboxModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DynamicScrollableDropdownModel, DynamicScrollableDropdownModelConfig } from '../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { Item } from '../../../core/shared/item.model';
import { Collection } from '../../../core/shared/collection.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { of as observableOf } from 'rxjs';

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
   * MetadataField to edit
   */
  @Input() mdField?: string;

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
   * The ConfidenceType enumeration for access in the component's template
   * @type {ConfidenceType}
   */
  public ConfidenceTypeEnum = ConfidenceType;

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
   * Whether or not the authority field is currently being edited
   */
  public editingAuthority = false;

  /**
   * Field group used by authority field
   * @type {UntypedFormGroup}
   */
  group = new UntypedFormGroup({ authorityField : new UntypedFormControl()});

  /**
   * Observable property of the model to use for editinf authorities values
   */
  private model$: Observable<DynamicOneboxModel | DynamicScrollableDropdownModel>;

  /**
   * Observable with information about the authority vocabulary used
   */
  private vocabulary$: Observable<Vocabulary>;

  /**
   * Observables with information about the authority vocabulary type used
   */
  private isAuthorityControlled$: Observable<boolean>;
  private isHierarchicalVocabulary$: Observable<boolean>;
  private isScrollableVocabulary$: Observable<boolean>;
  private isSuggesterVocabulary$: Observable<boolean>;

  constructor(protected relationshipService: RelationshipDataService,
              protected dsoNameService: DSONameService,
              protected vocabularyService: VocabularyService,
              protected itemService: ItemDataService) {
  }

  ngOnInit(): void {
    this.initVirtualProperties();
    this.initAuthorityProperties();
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
   * Initialise potential properties of a authority controlled metadata field
   */
  initAuthorityProperties(): void {

    if (isNotEmpty(this.mdField)) {

      const owningCollection$: Observable<Collection> = this.itemService.findByHref(this.dso._links.self.href, true, true, followLink('owningCollection'))
        .pipe(
          getFirstSucceededRemoteData(),
          getRemoteDataPayload(),
          switchMap((item: Item) => item.owningCollection),
          getFirstSucceededRemoteData(),
          getRemoteDataPayload()
        );

      this.vocabulary$ = owningCollection$.pipe(
        switchMap((c: Collection) => this.vocabularyService
          .getVocabularyByMetadataAndCollection(this.mdField, c.uuid)
            .pipe(
              getFirstSucceededRemoteDataPayload()
        ))
      );
    } else {
      this.vocabulary$ = observableOf(undefined);
    }

    this.isAuthorityControlled$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result))
    );

    this.isHierarchicalVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && result.hierarchical)
    );

    this.isScrollableVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && result.scrollable)
    );

    this.isSuggesterVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && !result.hierarchical && !result.scrollable)
    );

    this.model$ = this.vocabulary$.pipe(
        map((vocabulary: Vocabulary) => {
          let formFieldValue;
          if (isNotEmpty(this.mdValue.newValue.value)) {
            formFieldValue = new FormFieldMetadataValueObject();
            formFieldValue.value = this.mdValue.newValue.value;
            formFieldValue.display = this.mdValue.newValue.value;
            if (this.mdValue.newValue.authority) {
              formFieldValue.authority = this.mdValue.newValue.authority;
              formFieldValue.confidence = this.mdValue.newValue.confidence;
            }
          } else {
            formFieldValue = this.mdValue.newValue.value;
          }

          let vocabularyOptions = vocabulary ? {
            closed: false,
            name: vocabulary.name
          } as VocabularyOptions : null;

          if (!vocabulary.scrollable) {
            let model: DsDynamicOneboxModelConfig = {
              id: 'authorityField',
              label: `${this.dsoType}.edit.metadata.edit.value`,
              vocabularyOptions: vocabularyOptions,
              metadataFields: [this.mdField],
              value: formFieldValue,
              repeatable: false,
              submissionId: 'edit-metadata',
              hasSelectableMetadata: false,
            };
            return new DynamicOneboxModel(model);
          } else {
            let model: DynamicScrollableDropdownModelConfig = {
              id: 'authorityField',
              label: `${this.dsoType}.edit.metadata.edit.value`,
              placeholder: `${this.dsoType}.edit.metadata.edit.value`,
              vocabularyOptions: vocabularyOptions,
              metadataFields: [this.mdField],
              value: formFieldValue,
              repeatable: false,
              submissionId: 'edit-metadata',
              hasSelectableMetadata: false,
              maxOptions: 10
            };
            return new DynamicScrollableDropdownModel(model);
          }
      }));
  }

  /**
   * Checks if this field use a authority vocabulary
   */
  isAuthorityControlled(): Observable<boolean> {
    return this.isAuthorityControlled$;
  }

  /**
   * Checks if configured vocabulary is Hierarchical or not
   */
  isHierarchicalVocabulary(): Observable<boolean> {
    return this.isHierarchicalVocabulary$;
  }

  /**
   * Checks if configured vocabulary is Scrollable or not
   */
  isScrollableVocabulary(): Observable<boolean> {
    return this.isScrollableVocabulary$;
  }

  /**
   * Checks if configured vocabulary is Suggester or not
   * (a vocabulary not Scrollable and not Hierarchical that uses an autocomplete field)
   */
  isSuggesterVocabulary(): Observable<boolean> {
    return this.isSuggesterVocabulary$;
  }

  /**
   * Process the change of authority field value updating the authority key and confidence as necessary
   */
  onChangeAuthorityField(event): void {
    this.mdValue.newValue.value = event.value;
    if (event.authority) {
      this.mdValue.newValue.authority = event.authority;
      this.mdValue.newValue.confidence = ConfidenceType.CF_ACCEPTED;
    } else {
      this.mdValue.newValue.authority = null;
      this.mdValue.newValue.confidence = ConfidenceType.CF_UNSET;
    }
    this.confirm.emit(false);
  }

  /**
   * Returns an observable with the {@link DynamicOneboxModel} or {@link DynamicScrollableDropdownModel} model used
   * for the authority field
   */
  getModel(): Observable<DynamicOneboxModel | DynamicScrollableDropdownModel> {
    return this.model$;
  }

  /**
   * Change the status of the editingAuthority property
   * @param status
   */
  onChangeEditingAuthorityStatus(status: boolean) {
    this.editingAuthority = status;
  }

  /**
   * Processes the change in authority value, updating the confidence as necessary.
   * If the authority key is cleared, the confidence is set to {@link ConfidenceType.CF_NOVALUE}.
   * If the authority key is edited and differs from the original, the confidence is set to {@link ConfidenceType.CF_ACCEPTED}.
   */
  onChangeAuthorityKey() {
    if (this.mdValue.newValue.authority === '') {
      this.mdValue.newValue.confidence = ConfidenceType.CF_NOVALUE;
      this.confirm.emit(false);
    } else if (this.mdValue.newValue.authority !== this.mdValue.originalValue.authority) {
      this.mdValue.newValue.confidence = ConfidenceType.CF_ACCEPTED;
      this.confirm.emit(false);
    }
  }

}

import {
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { RegistryService } from 'src/app/core/registry/registry.service';
import { VocabularyService } from 'src/app/core/submission/vocabularies/vocabulary.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { Collection } from '../../../core/shared/collection.model';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import {
  MetadataRepresentation,
  MetadataRepresentationType,
} from '../../../core/shared/metadata-representation/metadata-representation.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
  metadataFieldsToString,
} from '../../../core/shared/operators';
import { Vocabulary } from '../../../core/submission/vocabularies/models/vocabulary.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { isNotEmpty } from '../../../shared/empty.util';
import { DsDynamicOneboxComponent } from '../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.component';
import {
  DsDynamicOneboxModelConfig,
  DynamicOneboxModel,
} from '../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DsDynamicScrollableDropdownComponent } from '../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig,
} from '../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { AuthorityConfidenceStateDirective } from '../../../shared/form/directives/authority-confidence-state.directive';
import { ThemedTypeBadgeComponent } from '../../../shared/object-collection/shared/badges/type-badge/themed-type-badge.component';
import { DebounceDirective } from '../../../shared/utils/debounce.directive';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { VarDirective } from '../../../shared/utils/var.directive';
import {
  DsoEditMetadataChangeType,
  DsoEditMetadataValue,
} from '../dso-edit-metadata-form';

@Component({
  selector: 'ds-dso-edit-metadata-value',
  styleUrls: ['./dso-edit-metadata-value.component.scss', '../dso-edit-metadata-shared/dso-edit-metadata-cells.scss'],
  templateUrl: './dso-edit-metadata-value.component.html',
  standalone: true,
  imports: [VarDirective, CdkDrag, NgClass, NgIf, FormsModule, DebounceDirective, RouterLink, ThemedTypeBadgeComponent, NgbTooltipModule, CdkDragHandle, AsyncPipe, TranslateModule, DsDynamicScrollableDropdownComponent, DsDynamicOneboxComponent, AuthorityConfidenceStateDirective],
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
  group = new UntypedFormGroup({ authorityField : new UntypedFormControl() });

  /**
   * Model to use for editing authorities values
   */
  private model$: BehaviorSubject<DynamicOneboxModel | DynamicScrollableDropdownModel> = new BehaviorSubject(null);

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

  constructor(
    protected relationshipService: RelationshipDataService,
    protected dsoNameService: DSONameService,
    protected vocabularyService: VocabularyService,
    protected itemService: ItemDataService,
    protected cdr: ChangeDetectorRef,
    protected registryService: RegistryService,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected metadataService: MetadataService,
  ) {
  }

  ngOnInit(): void {
    this.initVirtualProperties();
    this.initAuthorityProperties();
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
          getRemoteDataPayload(),
        );

      this.vocabulary$ = owningCollection$.pipe(
        switchMap((c: Collection) => this.vocabularyService
          .getVocabularyByMetadataAndCollection(this.mdField, c.uuid)
          .pipe(
            getFirstSucceededRemoteDataPayload(),
          )),
      );
    } else {
      this.vocabulary$ = observableOf(undefined);
    }

    this.isAuthorityControlled$ = this.vocabulary$.pipe(
      // Create the model used by the authority fields to ensure its existence when the field is initialized
      tap((v: Vocabulary) => this.model$.next(this.createModel(v))),
      map((result: Vocabulary) => isNotEmpty(result)),
    );

    this.isHierarchicalVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && result.hierarchical),
    );

    this.isScrollableVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && result.scrollable),
    );

    this.isSuggesterVocabulary$ = this.vocabulary$.pipe(
      map((result: Vocabulary) => isNotEmpty(result) && !result.hierarchical && !result.scrollable),
    );

  }

  /**
   * Returns a {@link DynamicOneboxModel} or {@link DynamicScrollableDropdownModel} model based on the
   * vocabulary used.
   */
  private createModel(vocabulary: Vocabulary): DynamicOneboxModel | DynamicScrollableDropdownModel {
    if (isNotEmpty(vocabulary)) {
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

      const vocabularyOptions = vocabulary ? {
        closed: false,
        name: vocabulary.name,
      } as VocabularyOptions : null;

      if (!vocabulary.scrollable) {
        const model: DsDynamicOneboxModelConfig = {
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
        const model: DynamicScrollableDropdownModelConfig = {
          id: 'authorityField',
          label: `${this.dsoType}.edit.metadata.edit.value`,
          placeholder: `${this.dsoType}.edit.metadata.edit.value`,
          vocabularyOptions: vocabularyOptions,
          metadataFields: [this.mdField],
          value: formFieldValue,
          repeatable: false,
          submissionId: 'edit-metadata',
          hasSelectableMetadata: false,
          maxOptions: 10,
        };
        return new DynamicScrollableDropdownModel(model);
      }
    } else {
      return null;
    }
  }

  /**
   * Change callback for the component. Check if the mdField has changed to retrieve whether it is metadata
   * that uses a controlled vocabulary and update the related properties
   *
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (isNotEmpty(changes.mdField) && !changes.mdField.firstChange) {
      if (isNotEmpty(changes.mdField.currentValue) ) {
        if (isNotEmpty(changes.mdField.previousValue) &&
          changes.mdField.previousValue !== changes.mdField.currentValue) {
          // Clear authority value in case it has been assigned with the previous metadataField used
          this.mdValue.newValue.authority = null;
          this.mdValue.newValue.confidence = ConfidenceType.CF_UNSET;
        }

        // Only ask if the current mdField have a period character to reduce request
        if (changes.mdField.currentValue.includes('.')) {
          this.validateMetadataField().subscribe((isValid: boolean) => {
            if (isValid) {
              this.initAuthorityProperties();
              this.cdr.detectChanges();
            }
          });
        }
      }
    }
  }

  /**
   * Validate the metadata field to check if it exists on the server and return an observable boolean for success/error
   */
  validateMetadataField(): Observable<boolean> {
    return this.registryService.queryMetadataFields(this.mdField, null, true, false, followLink('schema')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((rd) => {
        if (rd.hasSucceeded) {
          return observableOf(rd).pipe(
            metadataFieldsToString(),
            take(1),
            map((fields: string[]) => fields.indexOf(this.mdField) > -1),
          );
        } else {
          this.notificationsService.error(this.translate.instant(`${this.dsoType}.edit.metadata.metadatafield.error`), rd.errorMessage);
          return [false];
        }
      }),
    );
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
   * Returns the {@link DynamicOneboxModel} or {@link DynamicScrollableDropdownModel} model used
   * for the authority field
   */
  getModel(): DynamicOneboxModel | DynamicScrollableDropdownModel {
    return this.model$.value;
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

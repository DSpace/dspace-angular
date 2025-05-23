import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { ItemDataService } from '../../../../core/data/item-data.service';
import { RegistryService } from '../../../../core/registry/registry.service';
import { ConfidenceType } from '../../../../core/shared/confidence-type';
import {
  getFirstCompletedRemoteData,
  metadataFieldsToString,
} from '../../../../core/shared/operators';
import { Vocabulary } from '../../../../core/submission/vocabularies/models/vocabulary.model';
import { VocabularyOptions } from '../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { isNotEmpty } from '../../../../shared/empty.util';
import { DsDynamicOneboxComponent } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.component';
import {
  DsDynamicOneboxModelConfig,
  DynamicOneboxModel,
} from '../../../../shared/form/builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DsDynamicScrollableDropdownComponent } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig,
} from '../../../../shared/form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldMetadataValueObject } from '../../../../shared/form/builder/models/form-field-metadata-value.model';
import { AuthorityConfidenceStateDirective } from '../../../../shared/form/directives/authority-confidence-state.directive';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { DebounceDirective } from '../../../../shared/utils/debounce.directive';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { AbstractDsoEditMetadataValueFieldComponent } from '../abstract-dso-edit-metadata-value-field.component';
import { DsoEditMetadataFieldService } from '../dso-edit-metadata-field.service';

/**
 * The component used to gather input for authority controlled metadata fields
 */
@Component({
  selector: 'ds-dso-edit-metadata-authority-field',
  templateUrl: './dso-edit-metadata-authority-field.component.html',
  styleUrls: ['./dso-edit-metadata-authority-field.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    AuthorityConfidenceStateDirective,
    DebounceDirective,
    DsDynamicOneboxComponent,
    DsDynamicScrollableDropdownComponent,
    FormsModule,
    NgbTooltipModule,
    NgClass,
    TranslateModule,
  ],
})
export class DsoEditMetadataAuthorityFieldComponent extends AbstractDsoEditMetadataValueFieldComponent implements OnInit, OnChanges {

  /**
   * Whether the authority field is currently being edited
   */
  public editingAuthority = false;

  /**
   * Whether the free-text editing is enabled when scrollable dropdown or hierarchical vocabulary is used
   */
  public enabledFreeTextEditing = false;

  /**
   * Field group used by authority field
   */
  group = new UntypedFormGroup({ authorityField: new UntypedFormControl() });

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
  isAuthorityControlled$: Observable<boolean>;
  isHierarchicalVocabulary$: Observable<boolean>;
  isScrollableVocabulary$: Observable<boolean>;
  isSuggesterVocabulary$: Observable<boolean>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected dsoEditMetadataFieldService: DsoEditMetadataFieldService,
    protected itemService: ItemDataService,
    protected notificationsService: NotificationsService,
    protected registryService: RegistryService,
    protected translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initAuthorityProperties();
  }

  /**
   * Initialise potential properties of a authority controlled metadata field
   */
  initAuthorityProperties(): void {
    this.vocabulary$ = this.dsoEditMetadataFieldService.findDsoFieldVocabulary(this.dso, this.mdField);

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
      let formFieldValue: FormFieldMetadataValueObject | string;
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
      if (isNotEmpty(changes.mdField.currentValue)) {
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
          return of(rd).pipe(
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
   * Process the change of authority field value updating the authority key and confidence as necessary
   */
  onChangeAuthorityField(event): void {
    if (event) {
      this.mdValue.newValue.value = event.value;
      if (event.authority) {
        this.mdValue.newValue.authority = event.authority;
        this.mdValue.newValue.confidence = ConfidenceType.CF_ACCEPTED;
      } else {
        this.mdValue.newValue.authority = null;
        this.mdValue.newValue.confidence = ConfidenceType.CF_UNSET;
      }
      this.confirm.emit(false);
    } else {
      // The event is undefined when the user clears the selection in scrollable dropdown
      this.mdValue.newValue.value = '';
      this.mdValue.newValue.authority = null;
      this.mdValue.newValue.confidence = ConfidenceType.CF_UNSET;
      this.confirm.emit(false);
    }
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

  /**
   * Toggles the free-text editing mode
   */
  toggleFreeTextEdition() {
    if (this.enabledFreeTextEditing) {
      if (this.getModel().value !== this.mdValue.newValue.value) {
        // Reload the model to adapt it to the new possible value modified during free text editing
        this.initAuthorityProperties();
      }
    }
    this.enabledFreeTextEditing = !this.enabledFreeTextEditing;
  }

}

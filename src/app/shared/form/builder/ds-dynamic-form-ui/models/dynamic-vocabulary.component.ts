import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { Vocabulary } from '@dspace/core/submission/vocabularies/models/vocabulary.model';
import { VocabularyEntry } from '@dspace/core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormControlCustomEvent,
  DynamicFormControlModel,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs/operators';

import { SubmissionService } from '../../../../../submission/submission.service';
import { FormBuilderService } from '../../form-builder.service';
import { DsDynamicInputModel } from './ds-dynamic-input.model';


/**
 * An abstract class to be extended by form components that handle vocabulary
 */
@Component({
  selector: 'ds-dynamic-vocabulary',
  template: '',
})
export abstract class DsDynamicVocabularyComponent extends DynamicFormControlComponent {

  @Input() abstract group: UntypedFormGroup;
  @Input() abstract model: DsDynamicInputModel;

  @Output() abstract blur: EventEmitter<any>;
  @Output() abstract change: EventEmitter<any>;
  @Output() abstract focus: EventEmitter<any>;
  @Output() abstract customEvent: EventEmitter<DynamicFormControlCustomEvent>;

  /**
   * The vocabulary entry
   */
  public vocabulary$: Observable<Vocabulary> = of(null);

  /**
   * The PageInfo object
   */
  public abstract pageInfo: PageInfo;

  protected otherInfoValue: string;
  protected otherName: string;
  protected otherInfoKey: string;
  public otherInfoValues: string[] = [];
  public otherInfoValuesUnformatted: string[] = [];

  multiValueOnGenerator: boolean;

  protected constructor(protected vocabularyService: VocabularyService,
                        protected layoutService: DynamicFormLayoutService,
                        protected validationService: DynamicFormValidationService,
                        protected formBuilderService: FormBuilderService,
                        protected modalService: NgbModal,
                        protected submissionService: SubmissionService,
  ) {
    super(layoutService, validationService);
  }

  /**
   * Sets the current value with the given value.
   * @param value The value to set.
   * @param init Representing if is init value or not.
   */
  public abstract setCurrentValue(value: any, init?: boolean);

  /**
   * Retrieves the init form value from model
   * @param preserveConfidence if the original model confidence value should be used after retrieving the vocabulary's entry
   */
  getInitValueFromModel(preserveConfidence = false): Observable<FormFieldMetadataValueObject> {
    let initValue$: Observable<FormFieldMetadataValueObject>;
    if (isNotEmpty(this.model.value) && (this.model.value instanceof FormFieldMetadataValueObject) && !this.model.value.hasAuthorityToGenerate()) {
      let initEntry$: Observable<VocabularyEntry>;
      if (this.hasValidAuthority(this.model.value)) {
        initEntry$ = this.vocabularyService.getVocabularyEntryByID(this.model.value.authority, this.model.vocabularyOptions);
      } else {
        initEntry$ = this.vocabularyService.getVocabularyEntryByValue(this.model.value.value, this.model.vocabularyOptions);
      }
      initValue$ = initEntry$.pipe(map((initEntry: VocabularyEntry) => {
        if (isNotEmpty(initEntry)) {
          // Integrate FormFieldMetadataValueObject with retrieved information
          const formField = new FormFieldMetadataValueObject(
            initEntry.value,
            null,
            initEntry.authority,
            initEntry.display,
            (this.model.value as any).place,
            (this.model.value as any).confidence || null,
            initEntry.otherInformation || null,
          );
          // Preserve the original confidence
          if (preserveConfidence) {
            formField.confidence = (this.model.value as any).confidence;
          }
          return formField;
        } else {
          return this.model.value as any;
        }
      }));
    } else if (isNotEmpty(this.model.value) && (this.model.value instanceof VocabularyEntry)) {
      initValue$ = of(
        new FormFieldMetadataValueObject(
          this.model.value.value,
          null,
          this.model.value.authority,
          this.model.value.display,
          0,
          (this.model.value as any).confidence || null,
          this.model.value.otherInformation || null,
        ),
      );
    } else {
      initValue$ = of(new FormFieldMetadataValueObject(this.model.value));
    }
    return initValue$;
  }


  hasAuthorityValue(): boolean {
    return (hasValue(this.model.value) && (this.model.value instanceof FormFieldMetadataValueObject || this.model.value instanceof VocabularyEntry))
      ? this.model.value.hasAuthority() : false;
  }


  /**
   * Retrieve vocabulary object
   */
  initVocabulary(): void {
    if (this.model.value) {
      this.setCurrentValue(this.model.value, true);
    }
    this.vocabulary$ = this.vocabularyService.findVocabularyById(this.model.vocabularyOptions.name).pipe(
      getFirstSucceededRemoteDataPayload(),
      distinctUntilChanged(),
      tap((vocabulary: Vocabulary) => this.multiValueOnGenerator = vocabulary.multiValueOnGenerator),
    );
  }

  /**
   * Emits a blur event containing a given value.
   * @param event The value to emit.
   */
  onBlur(event: Event) {
    this.blur.emit(event);
  }

  /**
   * Emits a focus event containing a given value.
   * @param event The value to emit.
   */
  onFocus(event) {
    this.focus.emit(event);
  }

  /**
   * Emits a change event and updates model value.
   * @param updateValue
   */
  dispatchUpdate(updateValue: any) {
    this.model.value = updateValue;
    this.change.emit(updateValue);
    this.updateOtherInformation(updateValue);
  }

  /**
   * Update the model authority value.
   * @param authority
   */
  updateAuthority(authority: string) {
    const currentValue: string = (this.model.value instanceof FormFieldMetadataValueObject
      || this.model.value instanceof VocabularyEntry) ? this.model.value.value : this.model.value;
    const valueWithAuthority: any = new FormFieldMetadataValueObject(currentValue, null, authority);
    this.model.value = valueWithAuthority;
    this.change.emit(valueWithAuthority);
    setTimeout(() => {
      this.submissionService.dispatchSave(this.model.submissionId);
    }, 100);
  }

  /**
   * Update the page info object
   * @param elementsPerPage
   * @param currentPage
   * @param totalElements
   * @param totalPages
   */
  protected updatePageInfo(elementsPerPage: number, currentPage: number, totalElements?: number, totalPages?: number) {
    this.pageInfo = Object.assign(new PageInfo(), {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      totalElements: totalElements,
      totalPages: totalPages,
    });
  }

  /**
   * When the model was update check if new value contains otherInformation property and
   * try to populate related fields
   * @param value
   */
  updateOtherInformation(value: any) {
    if (hasValue(value) &&
      (value instanceof VocabularyEntry || value instanceof FormFieldMetadataValueObject)) {
      const otherInformation = value.otherInformation;
      if (hasValue(otherInformation)) {
        const updatedModels = [];
        for (const key in otherInformation) {
          if (otherInformation.hasOwnProperty(key) && key.startsWith('data-')) {
            const fieldId = key.replace('data-', '');
            const newValues: FormFieldMetadataValueObject[] = this.getOtherInformationValue(otherInformation[key], key);
            if (isNotEmpty(newValues)) {
              newValues.forEach((newValue) => {
                const updatedModel = this.formBuilderService.updateModelValue(fieldId, newValue);
                if (isNotEmpty(updatedModel)) {
                  updatedModels.push(updatedModel);
                }
              });
            }
          }
        }
        this.createChangeEventOnUpdate(updatedModels);
      }
    }
  }

  protected createChangeEventOnUpdate(models: DynamicFormControlModel[]) {
    if (models.length > 0) {
      this.onCustomEvent({ updatedModels: models }, 'authorityEnrichment');
    }
  }

  getOtherInformationValue(value: string, key: string): FormFieldMetadataValueObject[] {
    if (!isNotEmpty(value) || key === 'alternative-names' ) {
      return null;
    }

    const returnValue = [];
    if (value.indexOf('|||') === -1) {
      returnValue.push(this.generateFormField(value));
    } else if (value.indexOf('|||') !== -1 && this.otherInfoValue) {
      const otherValues: string[] = value.split('|||');
      if (this.multiValueOnGenerator) {
        otherValues.forEach((tmpValue) => returnValue.push(this.generateFormField(tmpValue)));
      } else {
        const unformattedValue = this.otherInfoValuesUnformatted.find(otherInfoValue => otherInfoValue.includes(this.otherInfoValue || this.otherName));
        const authorityValue = hasValue(unformattedValue) ? unformattedValue.substring(unformattedValue.lastIndexOf('::') + 2) : null;
        const otherInfo = {};
        let alternativeValue: string;
        otherInfo[key] = value;
        if (hasValue(this.otherName)) {
          alternativeValue = otherValues[0].substring(0, otherValues[0].lastIndexOf('::'));
        }
        returnValue.push(new FormFieldMetadataValueObject(
          hasValue(alternativeValue) ? alternativeValue : this.otherInfoValue,
          null,
          null,
          authorityValue,
          null,
          null,
          otherInfo,
        ));
      }
    }
    return returnValue;
  }

  private generateFormField(value: string): FormFieldMetadataValueObject {
    if (value.indexOf('::') === -1) {
      return new FormFieldMetadataValueObject(value);
    } else {
      return new FormFieldMetadataValueObject(
        value.substring(0, value.lastIndexOf('::')),
        null,
        null,
        value.substring(value.lastIndexOf('::') + 2),
      );
    }
  }

  private hasValidAuthority(formMetadataValue: FormFieldMetadataValueObject) {
    return Metadata.hasValidAuthority(formMetadataValue?.authority);
  }
}

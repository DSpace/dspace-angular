import { EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { isNotEmpty, hasValue } from '../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
import { VocabularyEntry } from '../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../form-builder.service';

/**
 * An abstract class to be extended by form components that handle vocabulary
 */
export abstract class DsDynamicVocabularyComponent extends DynamicFormControlComponent {

  @Input() abstract bindId = true;
  @Input() abstract group: FormGroup;
  @Input() abstract model: DsDynamicInputModel;

  @Output() abstract blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() abstract change: EventEmitter<any> = new EventEmitter<any>();
  @Output() abstract focus: EventEmitter<any> = new EventEmitter<any>();

  public abstract pageInfo: PageInfo;

  protected constructor(protected vocabularyService: VocabularyService,
                        protected layoutService: DynamicFormLayoutService,
                        protected validationService: DynamicFormValidationService,
                        protected formBuilderService: FormBuilderService
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
   */
  getInitValueFromModel(): Observable<FormFieldMetadataValueObject> {
    let initValue$: Observable<FormFieldMetadataValueObject>;
    if (isNotEmpty(this.model.value) && (this.model.value instanceof FormFieldMetadataValueObject)) {
      let initEntry$: Observable<VocabularyEntry>;
      if (this.model.value.hasAuthority()) {
        initEntry$ = this.vocabularyService.getVocabularyEntryByID(this.model.value.authority, this.model.vocabularyOptions)
      } else {
        initEntry$ = this.vocabularyService.getVocabularyEntryByValue(this.model.value.value, this.model.vocabularyOptions)
      }
      initValue$ = initEntry$.pipe(map((initEntry: VocabularyEntry) => {
        if (isNotEmpty(initEntry)) {
          // Integrate FormFieldMetadataValueObject with retrieved information
          return Object.assign(new FormFieldMetadataValueObject(), this.model.value, {
              value: initEntry.value,
              authority: initEntry.authority,
              display: initEntry.display,
              otherInformation: initEntry.otherInformation || null
          });
        } else {
          return this.model.value as any;
        }
      }));
    } else if (isNotEmpty(this.model.value) && (this.model.value instanceof VocabularyEntry)) {
      initValue$ = observableOf(Object.assign(new FormFieldMetadataValueObject(), this.model.value, {
        value: this.model.value.value,
        authority: this.model.value.authority,
        display: this.model.value.display,
        otherInformation: this.model.value.otherInformation || null
      }));
    } else {
      initValue$ = observableOf(new FormFieldMetadataValueObject(this.model.value));
    }
    return initValue$;
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
    this.model.valueUpdates.next(updateValue);
    this.change.emit(updateValue);
    this.updateOtherInformations(updateValue);
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
      totalPages: totalPages
    });
  }

  /**
   * When the model was update check if new value contains otherInformation property and
   * try to populate related fields
   * @param value
   */
  updateOtherInformations(value: any) {
    if (hasValue(value) &&
        (value instanceof VocabularyEntry || value instanceof FormFieldMetadataValueObject) ) {
      const otherInformation = value.otherInformation;
      if (hasValue(otherInformation)) {
        for (const key in otherInformation) {
          if (otherInformation.hasOwnProperty(key)) {
            const fieldId = key.replace('data-', '');
            const newValue = otherInformation[key];
            this.formBuilderService.updateValue(fieldId, newValue);
          }
        }
      }
    }
  }
}

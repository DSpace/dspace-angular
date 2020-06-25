import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { of as observableOf, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyFindOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-find-options.model';
import { hasValue, isEmpty, isNotEmpty, isNull, isUndefined } from '../../../../../empty.util';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DynamicLookupNameModel } from './dynamic-lookup-name.model';
import { ConfidenceType } from '../../../../../../core/shared/confidence-type';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';

@Component({
  selector: 'ds-dynamic-lookup',
  styleUrls: ['./dynamic-lookup.component.scss'],
  templateUrl: './dynamic-lookup.component.html'
})
export class DsDynamicLookupComponent extends DynamicFormControlComponent implements OnDestroy, OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: any;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public editMode = false;
  public firstInputValue = '';
  public secondInputValue = '';
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;

  protected searchOptions: VocabularyFindOptions;
  protected subs: Subscription[] = [];

  constructor(private vocabularyService: VocabularyService,
              private cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  inputFormatter = (x: { display: string }, y: number) => {
    return y === 1 ? this.firstInputValue : this.secondInputValue;
  };

  ngOnInit() {
    this.searchOptions = new VocabularyFindOptions(
      this.model.vocabularyOptions.scope,
      this.model.vocabularyOptions.name,
      this.model.vocabularyOptions.metadata,
      '',
      this.model.maxOptions,
      1);

    this.setInputsValue(this.model.value);

    this.subs.push(this.model.valueUpdates
      .subscribe((value) => {
        if (isEmpty(value)) {
          this.resetFields();
        } else if (!this.editMode) {
          this.setInputsValue(this.model.value);
        }
      }));
  }

  public formatItemForInput(item: any, field: number): string {
    if (isUndefined(item) || isNull(item)) {
      return '';
    }
    return (typeof item === 'string') ? item : this.inputFormatter(item, field);
  }

  public hasAuthorityValue() {
    return hasValue(this.model.value)
      && this.model.value.hasAuthority();
  }

  public hasEmptyValue() {
    return isNotEmpty(this.getCurrentValue());
  }

  public clearFields() {
    // Clear inputs whether there is no results and authority is closed
    if (this.model.vocabularyOptions.closed) {
      this.resetFields();
    }
  }

  public isEditDisabled() {
    return !this.hasAuthorityValue();
  }

  public isInputDisabled() {
    return (this.model.vocabularyOptions.closed && this.hasAuthorityValue() && !this.editMode);
  }

  public isLookupName() {
    return (this.model instanceof DynamicLookupNameModel);
  }

  public isSearchDisabled() {
    return isEmpty(this.firstInputValue) || this.editMode;
  }

  public onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  public onFocusEvent(event) {
    this.focus.emit(event);
  }

  public onChange(event) {
    event.preventDefault();
    if (!this.model.vocabularyOptions.closed) {
      if (isNotEmpty(this.getCurrentValue())) {
        const currentValue = new FormFieldMetadataValueObject(this.getCurrentValue());
        if (!this.editMode) {
          this.updateModel(currentValue);
        }
      } else {
        this.remove();
      }
    }
  }

  public onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.searchOptions.currentPage++;
      this.search();
    }
  }

  public onSelect(event) {
    this.updateModel(event);
  }

  public openChange(isOpened: boolean) {
    if (!isOpened) {
      if (this.model.vocabularyOptions.closed && !this.hasAuthorityValue()) {
        this.setInputsValue('');
      }
    }
  }

  public remove() {
    this.group.markAsPristine();
    this.model.valueUpdates.next(null);
    this.change.emit(null);
  }

  public saveChanges() {
    if (isNotEmpty(this.getCurrentValue())) {
      const newValue = Object.assign(new VocabularyEntry(), this.model.value, {
        display: this.getCurrentValue(),
        value: this.getCurrentValue()
      });
      this.updateModel(newValue);
    } else {
      this.remove();
    }
    this.switchEditMode();
  }

  public search() {
    this.optionsList = null;
    this.pageInfo = null;

    // Query
    this.searchOptions.query = this.getCurrentValue();

    this.loading = true;
    this.subs.push(this.vocabularyService.getVocabularyEntries(this.searchOptions).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() =>
        observableOf(new PaginatedList(
          new PageInfo(),
          []
        ))
      ),
      distinctUntilChanged())
      .subscribe((list: PaginatedList<VocabularyEntry>) => {
        console.log(list);
        this.optionsList = list.page;
        this.pageInfo = list.pageInfo;
        this.loading = false;
        this.cdr.detectChanges();
      }));
  }

  public switchEditMode() {
    this.editMode = !this.editMode;
  }

  public whenClickOnConfidenceNotAccepted(sdRef: NgbDropdown, confidence: ConfidenceType) {
    if (!this.model.readOnly) {
      sdRef.open();
      this.search();
    }
  }

  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  protected getCurrentValue(): string {
    let result = '';
    if (!this.isLookupName()) {
      result = this.firstInputValue;
    } else {
      if (isNotEmpty(this.firstInputValue)) {
        result = this.firstInputValue;
      }
      if (isNotEmpty(this.secondInputValue)) {
        result = isEmpty(result)
          ? this.secondInputValue
          : this.firstInputValue + (this.model as DynamicLookupNameModel).separator + ' ' + this.secondInputValue;
      }
    }
    return result;
  }

  protected resetFields() {
    this.firstInputValue = '';
    if (this.isLookupName()) {
      this.secondInputValue = '';
    }
  }

  protected setInputsValue(value) {
    if (hasValue(value)) {
      let displayValue = value;
      if (value instanceof FormFieldMetadataValueObject || value instanceof VocabularyEntry) {
        displayValue = value.display;
      }

      if (hasValue(displayValue)) {
        if (this.isLookupName()) {
          const values = displayValue.split((this.model as DynamicLookupNameModel).separator);

          this.firstInputValue = (values[0] || '').trim();
          this.secondInputValue = (values[1] || '').trim();
        } else {
          this.firstInputValue = displayValue || '';
        }
      }
    }
  }

  protected updateModel(value) {
    this.group.markAsDirty();
    this.model.valueUpdates.next(value);
    this.setInputsValue(value);
    this.change.emit(value);
    this.optionsList = null;
    this.pageInfo = null;
  }
}

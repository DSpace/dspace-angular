import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicLookupModel } from './dynamic-lookup.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { hasValue, isEmpty, isNotEmpty, isNull, isUndefined } from '../../../../../empty.util';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { Subscription } from 'rxjs/Subscription';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { DynamicLookupNameModel } from './dynamic-lookup-name.model';
import { ConfidenceType } from '../../../../../../core/integration/models/confidence-type';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-dynamic-lookup',
  styleUrls: ['./dynamic-lookup.component.scss'],
  templateUrl: './dynamic-lookup.component.html'
})
export class DsDynamicLookupComponent implements OnDestroy, OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicLookupModel | DynamicLookupNameModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public editMode = false;
  public firstInputValue = '';
  public secondInputValue = '';
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;

  protected searchOptions: IntegrationSearchOptions;
  protected sub: Subscription;

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef) {
  }

  inputFormatter = (x: { display: string }, y: number) => {
    return y === 1 ? this.firstInputValue : this.secondInputValue;
  };

  ngOnInit() {
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityOptions.scope,
      this.model.authorityOptions.name,
      this.model.authorityOptions.metadata,
      '',
      this.model.maxOptions,
      1);

    this.setInputsValue(this.model.value);

    this.model.valueUpdates
      .subscribe((value) => {
        if (isEmpty(value)) {
          this.resetFields();
        } else if (!this.editMode) {
          this.setInputsValue(this.model.value);
        }
      });
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
      if (value instanceof FormFieldMetadataValueObject || value instanceof AuthorityValue) {
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
    if (this.model.authorityOptions.closed) {
      this.resetFields();
    }
  }

  public isEditDisabled() {
    return !this.hasAuthorityValue();
  }

  public isInputDisabled() {
    return (this.model.authorityOptions.closed && this.hasAuthorityValue() && !this.editMode);
  }

  public isLookupName() {
    return (this.model instanceof DynamicLookupNameModel);
  }

  public isSearchDisabled() {
    return isEmpty(this.firstInputValue);
  }

  public onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  public onFocusEvent(event) {
    this.focus.emit(event);
  }

  public onInput(event) {
    if (!this.model.authorityOptions.closed) {
      if (isNotEmpty(this.getCurrentValue())) {
        const currentValue = new FormFieldMetadataValueObject(this.getCurrentValue());
        if (!this.editMode) {
          this.onSelect(currentValue);
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
    this.group.markAsDirty();
    this.model.valueUpdates.next(event);
    this.setInputsValue(event);
    this.change.emit(event);
    this.optionsList = null;
    this.pageInfo = null;
  }

  public openChange(isOpened: boolean) {
    if (!isOpened) {
      if (this.model.authorityOptions.closed && !this.hasAuthorityValue()) {
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
      const newValue = Object.assign(new AuthorityValue(), this.model.value, {
        display: this.getCurrentValue(),
        value: this.getCurrentValue()
      });
      this.onSelect(newValue);
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
    this.authorityService.getEntriesByName(this.searchOptions)
      .distinctUntilChanged()
      .subscribe((object: IntegrationData) => {
        this.optionsList = object.payload;
        this.pageInfo = object.pageInfo;
        this.loading = false;
        this.cdr.detectChanges();
      });
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
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}

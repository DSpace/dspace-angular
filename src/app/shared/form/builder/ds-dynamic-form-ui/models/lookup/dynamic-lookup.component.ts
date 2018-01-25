import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicLookupModel } from './dynamic-lookup.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';

@Component({
  selector: 'ds-dynamic-lookup',
  styleUrls: ['./dynamic-lookup.component.scss'],
  templateUrl: './dynamic-lookup.component.html'
})
export class DsDynamicLookupComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicLookupModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  // currentValue; Now is in model
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;
  protected searchOptions: IntegrationSearchOptions;

  // Only for LookupName
  lookupName: boolean;
  name2: string;
  // currentValue2; Now is in model

  constructor(private authorityService: AuthorityService) {
  }

  ngOnInit() {
    this.model.currentValue = '';
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      // this.model.maxOptions,
      1);

    // Switch Lookup/LookupName
    if (this.model.separator) {
      this.lookupName = true;
      this.model.currentValue2 = '';
      this.name2 = this.model.name + '2';
    }

    // Inital values shown in input fields
    // if (this.model.value != null) {
    //   if (!this.lookupName) {
    //     this.currentValue = (this.model.value as AuthorityModel).value;
    //   } else {
    //     this.splitValues();
    //   }
    // }
  }

  public formatItemForInput(item: any, field: number): string {
    if (isUndefined(item) || isNull(item)) {
      return '';
    }
    return (typeof item === 'string') ? item : this.inputFormatter(item, field);
  }

  // inputFormatter = (x: { display: string }) => x.display;
  inputFormatter = (x: { display: string }, y: number) => {
    this.splitValues();
    const out = y === 1 ? this.model.currentValue : this.model.currentValue2;
    return out;
  };

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.searchOptions.currentPage++;
      this.search();
    }
  }

  search() {
    this.searchOptions.query = this.lookupName ?
      this.model.currentValue + this.model.separator + this.model.currentValue2
      : this.model.currentValue;

    this.loading = true;
    this.authorityService.getEntriesByName(this.searchOptions)
      .distinctUntilChanged()
      .do(() => this.loading = false)
      .subscribe((object: IntegrationData) => {
        this.optionsList = object.payload;
        this.pageInfo = object.pageInfo;
      });
  }

  onSelect(event) {
    this.group.markAsDirty();

    if (this.lookupName) {
      this.splitValues(event.value);
    } else {
      this.model.currentValue = event.value;
    }

    this.model.valueUpdates.next(event);
    this.change.emit(event);
    this.optionsList = null;
    this.pageInfo = null;
  }

  remove(event) {
    this.group.markAsPristine();
    this.model.valueUpdates.next(null);
    this.change.emit(event);
  }

  onKeyUp(event) {
    if (event.keyCode === 13) {
      // Key: Enter
      this.search();
    }
  }

  splitValues(value?: string) {
    let received;
    if (value) {
      received = value;
    } else {
      received = (this.model.value as AuthorityModel).value;
    }
    const values = received.split(this.model.separator);
    this.model.currentValue = values[0];
    this.model.currentValue2 = values[1];
  }

  onChangeEvent(event: Event) {
    this.optionsList = null;
    this.pageInfo = null;
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent(event) {
    this.focus.emit(event);
  }

}

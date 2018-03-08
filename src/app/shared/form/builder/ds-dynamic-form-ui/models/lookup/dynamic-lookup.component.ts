import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicLookupModel } from './dynamic-lookup.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

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

  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;
  protected searchOptions: IntegrationSearchOptions;

  // Only for LookupName
  lookupName: boolean;
  name2: string;

  constructor(private authorityService: AuthorityService) {
  }

  ngOnInit() {
    // this.model.currentValue = '';
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      this.model.maxOptions,
      1);

    // Switch Lookup/LookupName
    if (this.model.separator) {
      this.lookupName = true;
      this.name2 = this.model.name + '2';
    }

    this.model.assignCurrentValues();

  }

  public formatItemForInput(item: any, field: number): string {
    if (isUndefined(item) || isNull(item)) {
      return '';
    }
    return (typeof item === 'string') ? item : this.inputFormatter(item, field);
  }

  // inputFormatter = (x: { display: string }) => x.display;
  inputFormatter = (x: { display: string }, y: number) => {
    // this.splitValues();
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
    this.optionsList = null;
    this.pageInfo = null;

    // Query
    this.searchOptions.query = '';
    if (!this.lookupName) {
      this.searchOptions.query = this.model.currentValue;
    } else {
      if (this.model.currentValue !== '') {
        this.searchOptions.query = this.model.currentValue;
      }
      if (this.model.currentValue2 !== '') {
        this.searchOptions.query = this.searchOptions.query === ''
          ? this.model.currentValue2
          : this.model.currentValue + this.model.separator + ' ' + this.model.currentValue2;
      }
    }

    this.loading = true;
    this.authorityService.getEntriesByName(this.searchOptions)
      .distinctUntilChanged()
      .do(() => this.loading = false)
      .subscribe((object: IntegrationData) => {
        this.optionsList = object.payload;
        this.pageInfo = object.pageInfo;
      });
  }

  noResults() {
    this.model.currentValue = '';
    if (this.lookupName) {
      this.model.currentValue2 = '';
    }
  }

  onSelect(event) {
    this.group.markAsDirty();
    this.model.valueUpdates.next(event);
    this.change.emit(event);
    this.optionsList = null;
    this.pageInfo = null;
  }

  isSearchDisabled() {
    if (this.model.currentValue === ''
      && (this.lookupName ? this.model.currentValue2 === '' : true)) {
      return true;
    }
    return false;
  }

  remove(event) {
    this.group.markAsPristine();
    this.model.valueUpdates.next(null);
    this.change.emit(event);
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent(event) {
    this.focus.emit(event);
  }

}

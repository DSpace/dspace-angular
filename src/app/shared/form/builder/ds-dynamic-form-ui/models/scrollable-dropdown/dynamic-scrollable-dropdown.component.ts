import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';

@Component({
  selector: 'ds-dynamic-scrollable-dropdown',
  styleUrls: ['./dynamic-scrollable-dropdown.component.scss'],
  templateUrl: './dynamic-scrollable-dropdown.component.html'
})
export class DsDynamicScrollableDropdownComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicScrollableDropdownModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      this.model.maxOptions,
      1);
    this.authorityService.getEntriesByName(this.searchOptions)
      .subscribe((object: IntegrationData) => {
        this.optionsList = object.payload;
        this.pageInfo = object.pageInfo;
        this.cdr.detectChanges();
      })
  }

  public formatItemForInput(item: any): string {
    if (isUndefined(item) || isNull(item)) { return '' }
    return (typeof item === 'string') ? item : this.inputFormatter(item);
  }

  inputFormatter = (x: {display: string}) => x.display;

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.searchOptions.currentPage++;
      this.authorityService.getEntriesByName(this.searchOptions)
        .do(() => this.loading = false)
        .subscribe((object: IntegrationData) => {
          this.optionsList = this.optionsList.concat(object.payload);
          this.pageInfo = object.pageInfo;
          this.cdr.detectChanges();
        })
    }
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent(event) {
    this.focus.emit(event);
  }

  onSelect(event) {
    this.group.markAsDirty();
    // (this.model as DynamicScrollableDropdownModel).parent as
    // this.group.get(this.model.id).setValue(event);
    this.model.valueUpdates.next(event)
    this.change.emit(event);
  }
}

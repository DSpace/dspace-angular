import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownResponseModel
} from './dynamic-scrollable-dropdown.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { DynamicFormControlEvent } from '@ng-dynamic-forms/core';

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

  ngOnInit() {
    this.model.retrieve(this.pageInfo)
      .subscribe((object: DynamicScrollableDropdownResponseModel) => {
        this.optionsList = object.list;
        this.pageInfo = object.pageInfo;
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
      this.pageInfo.currentPage++;
      this.model.retrieve(this.pageInfo)
        .do(() => this.loading = false)
        .subscribe((object) => {
          this.optionsList = this.optionsList.concat(object.list);
          this.pageInfo = object.pageInfo;

        })
    }
  }

  onBlurEvent(event: Event) {
    console.log('blur');
    this.blur.emit(event);
  }

  onFocusEvent($event) {
    console.log('focus');
    this.focus.emit(event);
  }

  onSelect(event) {
    this.group.markAsDirty();
    this.group.get(this.model.id).setValue(event);
    this.change.emit(event);
  }
}

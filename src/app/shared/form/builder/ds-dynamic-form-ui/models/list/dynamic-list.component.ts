import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { findKey } from 'lodash';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { DynamicListCheckboxGroupModel } from './dynamic-list-checkbox-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import {
  DynamicCheckboxModel,
  DynamicFormControlComponent, DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { DynamicListRadioGroupModel } from './dynamic-list-radio-group.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';

export interface ListItem {
  id: string,
  label: string,
  value: boolean,
  index: number
}

@Component({
  selector: 'ds-dynamic-list',
  styleUrls: ['./dynamic-list.component.scss'],
  templateUrl: './dynamic-list.component.html'
})

export class DsDynamicListComponent extends DynamicFormControlComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: any;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public items: ListItem[][] = [];
  protected optionsList: AuthorityValue[];
  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef,
              private formBuilderService: FormBuilderService,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit() {
    if (this.hasAuthorityOptions()) {
      // TODO Replace max elements 1000 with a paginated request when pagination bug is resolved
      this.searchOptions = new IntegrationSearchOptions(
        this.model.authorityOptions.scope,
        this.model.authorityOptions.name,
        this.model.authorityOptions.metadata,
        '',
        1000, // Max elements
        1);// Current Page
      this.setOptionsFromAuthority();
    }
  }

  onBlur(event: Event) {
    this.blur.emit(event);
  }

  onFocus(event: Event) {
    this.focus.emit(event);
  }

  onChange(event: Event) {
    const target = event.target as any;
    if (this.model.repeatable) {
      // Target tabindex coincide with the array index of the value into the authority list
      const authorityValue: AuthorityValue = this.optionsList[target.tabIndex];
      if (target.checked) {
        this.model.valueUpdates.next(authorityValue);
      } else {
        const newValue = [];
        this.model.value
          .filter((item) => item.value !== authorityValue.value)
          .forEach((item) => newValue.push(item));
        this.model.valueUpdates.next(newValue);
      }
    } else {
      (this.model as DynamicListRadioGroupModel).valueUpdates.next(this.optionsList[target.value]);
    }
    this.change.emit(event);
  }

  protected setOptionsFromAuthority() {
    if (this.model.authorityOptions.name && this.model.authorityOptions.name.length > 0) {
      const listGroup = this.group.controls[this.model.id] as FormGroup;
      this.authorityService.getEntriesByName(this.searchOptions).subscribe((authorities: IntegrationData) => {
        let groupCounter = 0;
        let itemsPerGroup = 0;
        let tempList: ListItem[] = [];
        this.optionsList = authorities.payload as AuthorityValue[];
        // Make a list of available options (checkbox/radio) and split in groups of 'model.groupLength'
        (authorities.payload as AuthorityValue[]).forEach((option, key) => {
          const value = option.id || option.value;
          const checked: boolean = isNotEmpty(findKey(
            this.model.value,
            (v) => v.value === option.value));

          const item: ListItem = {
            id: value,
            label: option.display,
            value: checked,
            index: key
          };
          if (this.model.repeatable) {
            this.formBuilderService.addFormGroupControl(listGroup, (this.model as DynamicListCheckboxGroupModel), new DynamicCheckboxModel(item));
          } else {
            (this.model as DynamicListRadioGroupModel).options.push({
              label: item.label,
              value: option
            });
          }
          tempList.push(item);
          itemsPerGroup++;
          this.items[groupCounter] = tempList;
          if (itemsPerGroup === this.model.groupLength) {
            groupCounter++;
            itemsPerGroup = 0;
            tempList = [];
          }
        });
        this.cdr.markForCheck();
      });

    }
  }

  protected hasAuthorityOptions() {
    return (hasValue(this.model.authorityOptions.scope)
      && hasValue(this.model.authorityOptions.name)
      && hasValue(this.model.authorityOptions.metadata));
  }
}

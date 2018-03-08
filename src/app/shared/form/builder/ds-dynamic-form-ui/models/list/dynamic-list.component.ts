import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { findKey, pull } from 'lodash';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { DynamicListCheckboxGroupModel } from './dynamic-list-checkbox-group.model';
import { ConfigData } from '../../../../../../core/config/config-data';
import { ConfigAuthorityModel } from '../../../../../../core/shared/config/config-authority.model';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicCheckboxModel } from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { DynamicListRadioGroupModel } from './dynamic-list-radio-group.model';
import { DsDynamicFormControlComponent } from '../../ds-dynamic-form-control.component';

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

// TODO Fare questo componente da zero
export class DsDynamicListComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicListCheckboxGroupModel | DynamicListRadioGroupModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public items: ListItem[][] = [];
  protected authorityList: AuthorityModel[];
  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef,
              private formBuilderService: FormBuilderService) {
  }

  ngOnInit() {
    if (this.hasAuthorityOptions()) {
      // TODO Replace max elements 1000 with a paginated request when pagination bug is resolved
      this.searchOptions = new IntegrationSearchOptions(
        this.model.authorityScope,
        this.model.authorityName,
        this.model.authorityMetadata,
        '',
        1000, // Max elements
        1);// Current Page
      this.setOptionsFromAuthority();
    }
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent(event: Event) {
    this.focus.emit(event);
  }

  onChangeEvent(event: Event) {
    const target = event.target as any;
    if (this.model.repeatable) {
      // Target tabindex coincide with the array index of the value into the authority list
      const authorityValue: AuthorityModel = this.authorityList[target.tabIndex];
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
      (this.model as DynamicListRadioGroupModel).valueUpdates.next(this.authorityList[target.value]);
    }
    this.change.emit(event);
  }

  protected setOptionsFromAuthority() {
    if (this.model.authorityName && this.model.authorityName.length > 0) {
      const listGroup = this.group.controls[this.model.id] as FormGroup;
      this.authorityService.getEntriesByName(this.searchOptions).subscribe((authorities: ConfigData) => {
        let groupCounter = 0;
        let itemsPerGroup = 0;
        let tempList: ListItem[] = [];
        this.authorityList = authorities.payload as ConfigAuthorityModel[];
        // Make a list of available options (checkbox/radio) and split in groups of 'model.groupLength'
        (authorities.payload as ConfigAuthorityModel[]).forEach((option, key) => {
          const value = option.id || option.value;
          const checked: boolean = isNotEmpty(findKey(
            this.model.value,
            {value: option.value}));

          const item: ListItem = {
            id: value,
            label: option.display,
            value: checked,
            index: key
          };
          if (this.model.repeatable) {
            this.formBuilderService.addFormGroupControl(listGroup, (this.model as DynamicListCheckboxGroupModel), new DynamicCheckboxModel(item));
          } else {
            (this.model as DynamicListRadioGroupModel).options.push({label: item.label, value: option});
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
        this.cdr.detectChanges();
      });

    }
  }

  protected hasAuthorityOptions() {
    return (hasValue(this.model.authorityScope)
      && hasValue(this.model.authorityName)
      && hasValue(this.model.authorityMetadata));
  }
}

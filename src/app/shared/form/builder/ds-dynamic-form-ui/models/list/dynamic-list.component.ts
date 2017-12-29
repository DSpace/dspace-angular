import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {AuthorityService} from '../../../../../../core/integration/authority.service';
import {IntegrationSearchOptions} from '../../../../../../core/integration/models/integration-options.model';
import {DynamicListModel, ListItem} from './dynamic-list.model';
import {ConfigData} from '../../../../../../core/config/config-data';
import {ConfigAuthorityModel} from '../../../../../../core/shared/config/config-authority.model';
import {DynamicCheckboxModel, DynamicFormGroupModel} from '@ng-dynamic-forms/core';

@Component({
  selector: 'ds-dynamic-list',
  styleUrls: ['./dynamic-list.component.scss'],
  templateUrl: './dynamic-list.component.html'
})

export class DsDynamicListComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicListModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  private groupBy = 5;

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService) {
  }

  ngOnInit() {
    this.model.items = [];
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      1000, // Max elements
      1);// Current Page

    this.setOptionsFromAuthority();
    // console.log("group is "+JSON.stringify(this.group));
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent(event) {
    this.focus.emit(event);
  }

  onChangeEvent(event) {
    this.group.controls[this.model.id].setValue(event);
    this.change.emit(event);
    // this.model.items[event.groupIndex][event.index] = event;
    // console.log(this.model.value);
  }

  protected setOptionsFromAuthority() {
    if (this.model.authorityName && this.model.authorityName.length > 0) {
      this.authorityService.getEntriesByName(this.searchOptions).subscribe((authorities: ConfigData) => {
        let tmpList = [];

        // TODO REMOVE, ONLY for test
        // let test = authorities.payload.map(a => Object.assign({}, a));
        // let testArray=[];
        // test.forEach(a => {
        //   for(let i=0; i<30; i++) {
        //     testArray.push(a);
        //   }
        // })
        // authorities.payload = testArray;

        (authorities.payload as ConfigAuthorityModel[]).forEach((option, key) => {
          const item: ListItem = {
            label: option.display,
            value: option.id || option.value,
            checked: false
          };
          tmpList.push(item);
          // TODO Check why it's necessary here
          this.group.addControl(item.value, new FormControl());
          (this.model as DynamicFormGroupModel).add(new DynamicCheckboxModel({id: item.label, label: item.value}));
          if (tmpList.length % this.groupBy === 0 || key + 1 === authorities.payload.length) {
            const groupIndex = Math.floor(tmpList.length / this.groupBy);
            const index = this.model.items.length % this.groupBy;
            const clone = tmpList.map((a) => Object.assign({}, a, {
              groupIndex: groupIndex,
              index: this.model.items.length
            }));
            this.model.items.push(Object.assign(clone));
            tmpList = [];
          }

        });

      });

    }
  }

}

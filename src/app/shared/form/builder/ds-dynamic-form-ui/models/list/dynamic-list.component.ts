import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { DynamicListModel } from "./dynamic-list.model";
import { ConfigData } from '../../../../../../core/config/config-data';
import { ConfigAuthorityModel } from '../../../../../../core/shared/config/config-authority.model';

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

  private items: ListItem[][];
  private groupBy: number = 5;

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService) {}

  ngOnInit() {
    this.items = [];
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      1000, //Max elements
      1);// Current Page

    this.setOptionsFromAuthority();
  }

  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent($event) {
    this.focus.emit(event);
  }

  onChangeEvent($event) {
    this.change.emit(event);
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
          const item = {
            label: option.display,
            value: option.id || option.value,
            checked: false
          };
          tmpList.push(item);

          if( tmpList.length % this.groupBy === 0 || key+1 === authorities.payload.length) {
            const clone = tmpList.map(a => Object.assign({}, a));
            this.items.push(Object.assign(clone));
            tmpList = [];
          }

        });

      });

    }
  }

}

interface ListItem {
  label,
  value,
  checked
};

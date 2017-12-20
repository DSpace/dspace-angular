import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {AuthorityService} from '../../../../../../core/integration/authority.service';
import {IntegrationSearchOptions} from '../../../../../../core/integration/models/integration-options.model';
import {isNotEmpty} from '../../../../../empty.util';
import {Chips} from "../../../../../chips/chips.model";
import {DynamicListModel} from "./dynamic-list.model";
import {IntegrationData} from "../../../../../../core/integration/integration-data";

@Component({
  selector: 'ds-dynamic-list',
  styleUrls: ['./dynamic-list.component.scss'],
  templateUrl: './dynamic-list.component.html'
})

// TODO Fare questo componente da zero
export class DsDynamicListComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicListModel;
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService) {}

  ngOnInit() {
    this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      10, //Max elements
      1);// Current Page

    // let authority = this.authorityService.getEntriesByName(this.searchOptions)
    //   .subscribe((object: IntegrationData) => {
    //     this.optionsList = object.payload;
    //     this.pageInfo = object.pageInfo;
    //   })
    //
    //
    //
    // const authorityValue = {
    //   id: fieldValue.authority,
    //   value: fieldValue.value,
    //   display: fieldValue.value
    // } as AuthorityModel;
    // listModel.value = authorityValue;


  }

  onInput(event) {
    if (event.data) {
      this.group.markAsDirty();
    }
  }
  onBlurEvent(event: Event) {
    this.blur.emit(event);
  }

  onFocusEvent($event) {
    this.focus.emit(event);
  }

  onSelect() {
    this.group.markAsDirty();
    this.group.get(this.model.id).setValue(event);
    this.change.emit(event);
  }

}

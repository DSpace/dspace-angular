import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {AuthorityService} from '../../../../../../core/integration/authority.service';
import {IntegrationSearchOptions} from '../../../../../../core/integration/models/integration-options.model';
import { isNotEmpty, isNotUndefined } from '../../../../../empty.util';
import {Chips} from "../../../../../chips/chips.model";
import {DynamicListModel} from "./dynamic-list.model";
import {IntegrationData} from "../../../../../../core/integration/integration-data";
import { ConfigData } from '../../../../../../core/config/config-data';
import { ConfigAuthorityModel } from '../../../../../../core/shared/config/config-authority.model';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormGroupModel } from '@ng-dynamic-forms/core';

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

  private items: {
    label,
    value,
    checked
  }[];

  protected searchOptions: IntegrationSearchOptions;

  constructor(private authorityService: AuthorityService, private formBuilderService: FormBuilderService) {}

  ngOnInit() {
    this.items = [];
    /*this.searchOptions = new IntegrationSearchOptions(
      this.model.authorityScope,
      this.model.authorityName,
      this.model.authorityMetadata,
      '',
      1000, // Max elements
      1);// Current Page
*/
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
        (authorities.payload as ConfigAuthorityModel[]).forEach((option, key) => {
          const item = {
            label: option.display,
            value: option.id || option.value,
            checked: false
          };
          this.items.push(item);
        });

        // let list = this.pushAuthorities(authorities);
        // const totalPages =  authorities.pageInfo.totalPages;
        // let currentPage = authorities.pageInfo.currentPage;
        // while ( currentPage < totalPages) {
        //   // TODO Gestire parser (modificare) list, checkbox se il model ha repeteable, sennò radiobutton.
        //   // gestire getEntriesByname come in tag con risultati paginati
        //   // vedere dynamic scrollable,
        //   // integrationsearchoption è il modello con le pagine. Io deve richiedere a partire da 1, il server risponde da 0.
        //   // L'ultima dimensione restituita di size è sbagliata
        //   // fare ListModel
        //   this.searchOptions.currentPage = currentPage+2;
        //   // this.authorityService.getEntriesByName(this.searchOptions).
        //   //
        //   //
        //   // currentPage
        // }


        // if (repeatable) {
        //   (controlModel as DynamicFormGroupModelConfig).group = list;
        // } else {
        //   (controlModel as DynamicRadioGroupModelConfig<any>).options = list;
        // }
      });

    }
  }

}

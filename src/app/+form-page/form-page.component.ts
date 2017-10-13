import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MY_DYNAMIC_FORM_MODEL, MY_DYNAMIC_FORM_MODEL2 } from './form-page.model';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';
import { FormService } from '../shared/form/form.service';
import { MY_DEFINITION_FORM_JSON } from './form-page.configuration.model';

@Component({
  styleUrls: ['./form-page.component.scss'],
  templateUrl: './form-page.component.html',
})
export class FormPageComponent implements OnInit {

  formId = 'testForm';
  formModel: DynamicFormControlModel[];
  formModel2: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL2;
  definition: any = MY_DEFINITION_FORM_JSON;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formModel = this.formService.fromConfiguration(this.definition);
    // this.formModel = MY_DYNAMIC_FORM_MODEL;
  }
}
/*
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {
  DynamicTypeaheadModel,
  DynamicTypeaheadModelConfig
} from '../shared/form/model/typeahead/dynamic-typeahead.model';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  templateUrl: 'form-page.component.html',
  styles: [`.form-control { width: 300px; }`]
})
export class FormPageComponent {
  config: DynamicTypeaheadModelConfig = {
    id: 'test',
    /*search: (text: string) => {
      let returnValue: any;
      setTimeout(() => {
        returnValue = Observable.of(
          states.filter((v) => v.toLowerCase().indexOf(text.toLowerCase()) > -1))
      }, 2000);
      return returnValue;
    },
    search: (text: string) =>
      Observable.of(
        states.filter((v) => v.toLowerCase().indexOf(text.toLowerCase()) > -1))
  }
  public model: DynamicTypeaheadModel = new DynamicTypeaheadModel(this.config);
  public value;

}*/

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MY_DYNAMIC_FORM_MODEL, MY_DYNAMIC_FORM_MODEL2 } from './form-page.model';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';
import { FormBuilderService } from '../shared/form/builder/form-builder.service';

import MY_DEFINITION_FORM_JSON from '../../backend/data/form1-definition.json';
import MY_DEFINITION_FORM2_JSON from '../../backend/data/form2-definition.json';

@Component({
  styleUrls: ['./form-page.component.scss'],
  templateUrl: './form-page.component.html',
})
export class FormPageComponent implements OnInit {

  formId = 'testForm';
  formModel: DynamicFormControlModel[];
  formModel2: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL2;
  definition: any = MY_DEFINITION_FORM_JSON;

  constructor(private formBuilderService: FormBuilderService) {}

  ngOnInit() {
    this.formModel = this.formBuilderService.modelFromConfiguration(this.definition);
    // this.formModel = MY_DYNAMIC_FORM_MODEL;
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MY_DYNAMIC_FORM_MODEL, MY_DYNAMIC_FORM_MODEL2 } from './form-page.model';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';

@Component({
  styleUrls: ['./form-page.component.scss'],
  templateUrl: './form-page.component.html',
})
export class FormPageComponent {

  formId: string = 'testForm';
  formModel: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL;
  formModel2: DynamicFormControlModel[] = MY_DYNAMIC_FORM_MODEL2;
}

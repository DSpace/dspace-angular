import { NgModule } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormsCoreModule, DynamicFormService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TextMaskModule } from 'angular2-text-mask';

import { FormComponent } from './form.component';
import {
  DsDynamicFormControlComponent
} from './builder/ds-dynamic-form-ui/ds-dynamic-form-control.component';
import {
  DsDynamicFormComponent
} from './builder/ds-dynamic-form-ui/ds-dynamic-form.component';
import { DsDynamicTypeaheadComponent } from './builder/model/typeahead/dynamic-typeahead.component';
import { DsDynamicScrollableDropdownComponent } from './builder/model/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { FormService } from './form.service';
import { FormBuilderService } from './builder/form-builder.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    NgbTypeaheadModule.forRoot(),
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsNGBootstrapUIModule,
    TextMaskModule
  ],
  declarations: [
    DsDynamicFormComponent,
    DsDynamicFormControlComponent,
    DsDynamicScrollableDropdownComponent,
    DsDynamicTypeaheadComponent,
    FormComponent,
  ],
  exports: [
    DsDynamicFormComponent,
    DsDynamicFormControlComponent,
    DsDynamicScrollableDropdownComponent,
    DsDynamicTypeaheadComponent,
    FormComponent
  ],
  providers: [
    BaseRequestOptions,
    DynamicFormService,
    DynamicFormValidationService,
    FormService,
    FormBuilderService
  ]
})
export class FormModule {}

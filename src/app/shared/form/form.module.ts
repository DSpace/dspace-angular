import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { DsDynamicFormComponent } from './builder/ds-dynamic-form-ui/ds-dynamic-form.component';
import {
  DsDynamicFormControlContainerComponent,
  dsDynamicFormControlMapFn
} from './builder/ds-dynamic-form-ui/ds-dynamic-form-control-container.component';
import { DsDynamicListComponent } from './builder/ds-dynamic-form-ui/models/list/dynamic-list.component';
import { DsDynamicLookupComponent } from './builder/ds-dynamic-form-ui/models/lookup/dynamic-lookup.component';
import { DsDynamicDisabledComponent } from './builder/ds-dynamic-form-ui/models/disabled/dynamic-disabled.component';
import { DsDynamicLookupRelationModalComponent } from './builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { DsDynamicScrollableDropdownComponent } from './builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicTagComponent } from './builder/ds-dynamic-form-ui/models/tag/dynamic-tag.component';
import { DsDynamicOneboxComponent } from './builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.component';
import { DsDynamicRelationGroupComponent } from './builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.components';
import { DsDatePickerComponent } from './builder/ds-dynamic-form-ui/models/date-picker/date-picker.component';
import { DsDynamicFormGroupComponent } from './builder/ds-dynamic-form-ui/models/form-group/dynamic-form-group.component';
import { DsDynamicFormArrayComponent } from './builder/ds-dynamic-form-ui/models/array-group/dynamic-form-array.component';
import { DsDatePickerInlineComponent } from './builder/ds-dynamic-form-ui/models/date-picker-inline/dynamic-date-picker-inline.component';
import { DsDynamicLookupRelationSearchTabComponent } from './builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component';
import { DsDynamicLookupRelationSelectionTabComponent } from './builder/ds-dynamic-form-ui/relation-lookup-modal/selection-tab/dynamic-lookup-relation-selection-tab.component';
import { DsDynamicLookupRelationExternalSourceTabComponent } from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from '../search/search.module';
import { DYNAMIC_FORM_CONTROL_MAP_FN, DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { ExistingMetadataListElementComponent } from './builder/ds-dynamic-form-ui/existing-metadata-list-element/existing-metadata-list-element.component';
import { ExistingRelationListElementComponent } from './builder/ds-dynamic-form-ui/existing-relation-list-element/existing-relation-list-element.component';
import { ExternalSourceEntryImportModalComponent } from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component';
import { CustomSwitchComponent } from './builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.component';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';

const COMPONENTS = [
  CustomSwitchComponent,
  DsDynamicFormComponent,
  DsDynamicFormControlContainerComponent,
  DsDynamicListComponent,
  DsDynamicLookupComponent,
  DsDynamicLookupRelationSearchTabComponent,
  DsDynamicLookupRelationSelectionTabComponent,
  DsDynamicLookupRelationExternalSourceTabComponent,
  DsDynamicDisabledComponent,
  DsDynamicLookupRelationModalComponent,
  DsDynamicScrollableDropdownComponent,
  DsDynamicTagComponent,
  DsDynamicOneboxComponent,
  DsDynamicRelationGroupComponent,
  DsDatePickerComponent,
  DsDynamicFormGroupComponent,
  DsDynamicFormArrayComponent,
  DsDatePickerInlineComponent,
  ExistingMetadataListElementComponent,
  ExistingRelationListElementComponent,
  ExternalSourceEntryImportModalComponent,
  FormComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    DynamicFormsCoreModule,
    DynamicFormsNGBootstrapUIModule,
    SearchModule,
    SharedModule,
    TranslateModule
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: [
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: dsDynamicFormControlMapFn
    }
  ]
})
export class FormModule {
}

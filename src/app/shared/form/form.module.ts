import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDatepickerModule, NgbTimepickerModule, } from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicFormLayoutService,
  DynamicFormsCoreModule,
  DynamicFormService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';

import { SearchModule } from '../search/search.module';
import { SharedModule } from '../shared.module';
import { DsDynamicFormComponent } from './builder/ds-dynamic-form-ui/ds-dynamic-form.component';
import {
  DsDynamicFormControlContainerComponent,
  dsDynamicFormControlMapFn,
} from './builder/ds-dynamic-form-ui/ds-dynamic-form-control-container.component';
import { DsDynamicTypeBindRelationService } from './builder/ds-dynamic-form-ui/ds-dynamic-type-bind-relation.service';
import {
  ExistingMetadataListElementComponent
} from './builder/ds-dynamic-form-ui/existing-metadata-list-element/existing-metadata-list-element.component';
import {
  ExistingRelationListElementComponent
} from './builder/ds-dynamic-form-ui/existing-relation-list-element/existing-relation-list-element.component';
import {
  DsDynamicFormArrayComponent
} from './builder/ds-dynamic-form-ui/models/array-group/dynamic-form-array.component';
import { CustomSwitchComponent } from './builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.component';
import { DsDatePickerComponent } from './builder/ds-dynamic-form-ui/models/date-picker/date-picker.component';
import {
  DsDatePickerInlineComponent
} from './builder/ds-dynamic-form-ui/models/date-picker-inline/dynamic-date-picker-inline.component';
import { DsDynamicDisabledComponent } from './builder/ds-dynamic-form-ui/models/disabled/dynamic-disabled.component';
import {
  DsDynamicFormGroupComponent
} from './builder/ds-dynamic-form-ui/models/form-group/dynamic-form-group.component';
import { DsDynamicListComponent } from './builder/ds-dynamic-form-ui/models/list/dynamic-list.component';
import { DsDynamicLookupComponent } from './builder/ds-dynamic-form-ui/models/lookup/dynamic-lookup.component';
import { DsDynamicOneboxComponent } from './builder/ds-dynamic-form-ui/models/onebox/dynamic-onebox.component';
import {
  DsDynamicRelationGroupComponent
} from './builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.components';
import {
  DsDynamicScrollableDropdownComponent
} from './builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicTagComponent } from './builder/ds-dynamic-form-ui/models/tag/dynamic-tag.component';
import {
  DsDynamicLookupRelationModalComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import {
  DsDynamicLookupRelationExternalSourceTabComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import {
  ExternalSourceEntryImportModalComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component';
import {
  ThemedExternalSourceEntryImportModalComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/themed-external-source-entry-import-modal.component';
import {
  ThemedDynamicLookupRelationExternalSourceTabComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/themed-dynamic-lookup-relation-external-source-tab.component';
import {
  DsDynamicLookupRelationSearchTabComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component';
import {
  ThemedDynamicLookupRelationSearchTabComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/themed-dynamic-lookup-relation-search-tab.component';
import {
  DsDynamicLookupRelationSelectionTabComponent
} from './builder/ds-dynamic-form-ui/relation-lookup-modal/selection-tab/dynamic-lookup-relation-selection-tab.component';
import { FormBuilderService } from './builder/form-builder.service';
import { ChipsComponent } from './chips/chips.component';
import { AuthorityConfidenceStateDirective } from './directives/authority-confidence-state.directive';
import { FormComponent } from './form.component';
import { FormService } from './form.service';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VocabularyTreeviewComponent } from './vocabulary-treeview/vocabulary-treeview.component';
import { VocabularyTreeviewModalComponent } from './vocabulary-treeview-modal/vocabulary-treeview-modal.component';
import {
  DsDynamicRelationGroupModalComponent
} from './builder/ds-dynamic-form-ui/models/relation-group/modal/dynamic-relation-group-modal.components';
import {
  DsDynamicRelationInlineGroupComponent
} from './builder/ds-dynamic-form-ui/models/relation-inline-group/dynamic-relation-inline-group.components';

const COMPONENTS = [
  CustomSwitchComponent,
  DsDynamicFormComponent,
  DsDynamicFormControlContainerComponent,
  DsDynamicListComponent,
  DsDynamicLookupComponent,
  DsDynamicLookupRelationSearchTabComponent,
  ThemedDynamicLookupRelationSearchTabComponent,
  DsDynamicLookupRelationSelectionTabComponent,
  DsDynamicLookupRelationExternalSourceTabComponent,
  ThemedDynamicLookupRelationExternalSourceTabComponent,
  DsDynamicDisabledComponent,
  DsDynamicLookupRelationModalComponent,
  DsDynamicRelationGroupModalComponent,
  DsDynamicRelationInlineGroupComponent,
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
  FormComponent,
  ChipsComponent,
  NumberPickerComponent,
  VocabularyTreeviewComponent,
  VocabularyTreeviewModalComponent,
  ThemedExternalSourceEntryImportModalComponent,
];

const DIRECTIVES = [
  AuthorityConfidenceStateDirective,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
    DynamicFormsCoreModule,
    DynamicFormsNGBootstrapUIModule,
    SearchModule,
    SharedModule,
    TranslateModule,
    NgxMaskModule.forRoot(),
    NgbDatepickerModule,
    NgbTimepickerModule,
    CdkTreeModule,
    DragDropModule,
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: dsDynamicFormControlMapFn,
    },
    DynamicFormLayoutService,
    DynamicFormService,
    DynamicFormValidationService,
    FormBuilderService,
    DsDynamicTypeBindRelationService,
    FormService,
  ],
})
export class FormModule {
}

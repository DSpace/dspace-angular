import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrectionSuggestionComponent } from './correction-suggestion.component';
import { SharedModule } from '../shared.module';
import { CorrectionSuggestionRoutingModule } from './correction-suggestion-routing.module';
import { ManageRelationCorrectionTypeComponent } from './correction-types/manage-relation-correction-type/manage-relation-correction-type.component';
import { SearchModule } from '../search/search.module';

const COMPONENTS = [
  CorrectionSuggestionComponent,
  ManageRelationCorrectionTypeComponent,
];

const ENTRY_COMPONENTS = [
  ManageRelationCorrectionTypeComponent,
];

@NgModule({
  declarations: [
    COMPONENTS,
  ],
  imports: [
    CommonModule,
    CorrectionSuggestionRoutingModule,
    SharedModule,
    SearchModule
  ],
  exports: [
    COMPONENTS,
  ]
})
export class CorrectionSuggestionModule {
  static withEntryComponents() {
    return {
      ngModule: CorrectionSuggestionModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
 }

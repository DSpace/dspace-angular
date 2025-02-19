import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../../../../app/shared/btn-disabled.directive';
import { DsDynamicLookupRelationModalComponent as BaseComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { ThemedDynamicLookupRelationExternalSourceTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/themed-dynamic-lookup-relation-external-source-tab.component';
import { ThemedDynamicLookupRelationSearchTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/themed-dynamic-lookup-relation-search-tab.component';
import { DsDynamicLookupRelationSelectionTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/selection-tab/dynamic-lookup-relation-selection-tab.component';
import { ThemedLoadingComponent } from '../../../../../../../../app/shared/loading/themed-loading.component';


@Component({
  selector: 'ds-themed-dynamic-lookup-relation-modal',
  styleUrls: ['../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.scss'],
  templateUrl: '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.html',
  // templateUrl: './dynamic-lookup-relation-modal.component.html',
  imports: [
    ThemedDynamicLookupRelationExternalSourceTabComponent,
    TranslateModule,
    ThemedLoadingComponent,
    NgIf,
    NgbNavModule,
    ThemedDynamicLookupRelationSearchTabComponent,
    AsyncPipe,
    NgForOf,
    DsDynamicLookupRelationSelectionTabComponent,
    BtnDisabledDirective,
  ],
  standalone: true,
})
export class DsDynamicLookupRelationModalComponent extends BaseComponent {}

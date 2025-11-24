import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { BtnDisabledDirective } from '../../../../../../../../app/shared/btn-disabled.directive';
import { DynamicLookupRelationModalComponent as BaseComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { ThemedDynamicLookupRelationExternalSourceTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/themed-dynamic-lookup-relation-external-source-tab.component';
import { ThemedDynamicLookupRelationSearchTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/themed-dynamic-lookup-relation-search-tab.component';
import { DsDynamicLookupRelationSelectionTabComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/selection-tab/dynamic-lookup-relation-selection-tab.component';
import { ThemedLoadingComponent } from '../../../../../../../../app/shared/loading/themed-loading.component';
import { SearchConfigurationService } from '../../../../../../../../app/shared/search/search-configuration.service';

@Component({
  selector: 'ds-themed-dynamic-lookup-relation-modal',
  // styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  styleUrls: ['../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.scss'],
  // templateUrl: './dynamic-lookup-relation-modal.component.html',
  templateUrl: '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    DsDynamicLookupRelationSelectionTabComponent,
    NgbNavModule,
    ThemedDynamicLookupRelationExternalSourceTabComponent,
    ThemedDynamicLookupRelationSearchTabComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class DynamicLookupRelationModalComponent extends BaseComponent {
}

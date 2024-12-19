import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { DsDynamicLookupRelationSearchTabComponent as BaseComponent } from '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component';
import { ThemedSearchComponent } from '../../../../../../../../../app/shared/search/themed-search.component';
import { VarDirective } from '../../../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-dynamic-lookup-relation-search-tab',
  // styleUrls: ['./dynamic-lookup-relation-search-tab.component.scss'],
  styleUrls: ['../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component.scss'],
  // templateUrl: './dynamic-lookup-relation-search-tab.component.html',
  templateUrl: '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    VarDirective,
    TranslateModule,
    NgbDropdownModule,
    NgIf,
    ThemedSearchComponent,
  ],
})
export class DsDynamicLookupRelationSearchTabComponent extends BaseComponent {

}

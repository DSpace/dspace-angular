import { DsDynamicLookupRelationSearchTabComponent as BaseComponent } from '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component';
import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../../../../app/core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-dynamic-lookup-relation-search-tab',
  // styleUrls: ['./dynamic-lookup-relation-search-tab.component.scss'],
  styleUrls: ['../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component.scss'],
  // templateUrl: './dynamic-lookup-relation-search-tab.component.html',
  templateUrl: '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class DsDynamicLookupRelationSearchTabComponent extends BaseComponent {

}

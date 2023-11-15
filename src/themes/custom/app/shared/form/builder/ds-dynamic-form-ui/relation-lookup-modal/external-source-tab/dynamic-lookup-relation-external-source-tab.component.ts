import { DsDynamicLookupRelationExternalSourceTabComponent as BaseComponent } from '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../../../../app/core/shared/search/search-configuration.service';
import { fadeIn, fadeInOut } from '../../../../../../../../../app/shared/animations/fade';

@Component({
  selector: 'ds-dynamic-lookup-relation-external-source-tab',
  // styleUrls: ['./dynamic-lookup-relation-external-source-tab.component.scss'],
  styleUrls: ['../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component.scss'],
  // templateUrl: './dynamic-lookup-relation-external-source-tab.component.html',
  templateUrl: '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class DsDynamicLookupRelationExternalSourceTabComponent extends BaseComponent {

}

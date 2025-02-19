import { Component } from '@angular/core';
import {
  DsDynamicLookupRelationModalComponent as BaseComponent
} from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import {
  SearchConfigurationService
} from '../../../../../../../../app/core/shared/search/search-configuration.service';


@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.scss'],
  // templateUrl: '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component.html',
  templateUrl: './dynamic-lookup-relation-modal.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
})
export class DsDynamicLookupRelationModalComponent extends BaseComponent {}

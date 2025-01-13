import { Component } from '@angular/core';

import { SearchConfigurationService } from '../../../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import { DynamicLookupRelationModalComponent as BaseComponent } from '../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
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
})
export class DynamicLookupRelationModalComponent extends BaseComponent {
}

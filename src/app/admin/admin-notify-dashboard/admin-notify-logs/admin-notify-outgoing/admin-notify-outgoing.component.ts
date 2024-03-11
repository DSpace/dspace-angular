import {
  Component,
  Inject,
} from '@angular/core';

import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-admin-notify-outgoing',
  templateUrl: './admin-notify-outgoing.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
})
export class AdminNotifyOutgoingComponent {
  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }
}

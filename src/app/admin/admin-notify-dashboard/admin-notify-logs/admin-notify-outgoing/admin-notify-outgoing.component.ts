import { Component, Inject } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { Context } from '../../../../core/shared/context.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';


@Component({
  selector: 'ds-admin-notify-outgoing',
  templateUrl: './admin-notify-outgoing.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyOutgoingComponent {
  protected readonly context = Context.CoarNotify;

  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }
}

import { Component, Inject } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { Context } from '../../../../core/shared/context.model';
import { SearchConfigurationService } from "../../../../core/shared/search/search-configuration.service";


@Component({
  selector: 'ds-admin-notify-incoming',
  templateUrl: './admin-notify-incoming.component.html',
  styleUrls: ['./admin-notify-incoming.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyIncomingComponent {
  protected readonly context = Context.CoarNotifyIncoming;
  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }
}

import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { Context } from '../../../../core/shared/context.model';


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
  protected readonly context = Context.CoarNotify;
}

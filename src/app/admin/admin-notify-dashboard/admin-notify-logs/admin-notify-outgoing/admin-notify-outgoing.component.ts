import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { Context } from '../../../../core/shared/context.model';


@Component({
  selector: 'ds-admin-notify-outgoing',
  templateUrl: './admin-notify-outgoing.component.html',
  styleUrls: ['./admin-notify-outgoing.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyOutgoingComponent {
  protected readonly context = Context.CoarNotify;
}

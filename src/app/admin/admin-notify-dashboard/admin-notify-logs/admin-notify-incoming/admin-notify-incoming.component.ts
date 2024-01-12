import { Component, Inject, OnInit } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { Context } from '../../../../core/shared/context.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';


@Component({
  selector: 'ds-admin-notify-incoming',
  templateUrl: './admin-notify-incoming.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyIncomingComponent implements OnInit{
  public defaultConfiguration = 'NOTIFY.incoming';
  protected readonly context = Context.CoarNotify;
  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }

  ngOnInit() {
    this.searchConfigService.getCurrentConfiguration('').subscribe(x => console.log(x));
  }

}

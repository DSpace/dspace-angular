import { Component, Input, OnInit } from '@angular/core';
import { AdminNotifyMetricsRow } from './admin-notify-metrics.model';
import { ActivatedRoute, Router } from "@angular/router";
import { ViewMode } from "../../../core/shared/view-mode.model";

@Component({
  selector: 'ds-admin-notify-metrics',
  templateUrl: './admin-notify-metrics.component.html',
})
export class AdminNotifyMetricsComponent {

  @Input()
  boxesConfig: AdminNotifyMetricsRow[];

  private incomingConfiguration = 'NOTIFY.incoming';
  private inboundPath = '/inbound';
  private outboundPath = '/outbound';

  constructor(private router: Router) {
  }


  public navigateToSelectedSearchConfig(searchConfig: string) {
    const isIncomingConfig = searchConfig.startsWith(this.incomingConfiguration);
    const selectedPath = isIncomingConfig ? this.inboundPath : this.outboundPath;

    this.router.navigate([`${this.router.url}${selectedPath}`], {
      queryParams: {
        configuration: searchConfig,
        view: ViewMode.Table
      },
    })
  }
}

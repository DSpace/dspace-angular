import { Component, Input } from '@angular/core';

import { HealthInfoResponse } from '../models/health-component.model';

@Component({
  selector: 'ds-health-info',
  templateUrl: './health-info.component.html',
  styleUrls: ['./health-info.component.scss']
})
export class HealthInfoComponent {

  @Input() healthInfoResponse: HealthInfoResponse;

}

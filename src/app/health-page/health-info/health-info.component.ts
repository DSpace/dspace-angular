import { Component, Input, OnInit } from '@angular/core';

import { HealthInfoResponse } from '../models/health-component.model';

@Component({
  selector: 'ds-health-info',
  templateUrl: './health-info.component.html',
  styleUrls: ['./health-info.component.scss']
})
export class HealthInfoComponent implements OnInit  {

  @Input() healthInfoResponse: HealthInfoResponse;

  /**
   * The first active panel id
   */
  activeId: string;

  ngOnInit(): void {
    this.activeId = Object.keys(this.healthInfoResponse)[0];
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { HealthResponse } from '../models/health-component.model';

@Component({
  selector: 'ds-health-panel',
  templateUrl: './health-panel.component.html',
  styleUrls: ['./health-panel.component.scss']
})
export class HealthPanelComponent implements OnInit {

  /**
   * Health endpoint response
   */
  @Input() healthResponse: HealthResponse;

  /**
   * The first active panel id
   */
  activeId: string;

  ngOnInit(): void {
    this.activeId = Object.keys(this.healthResponse.components)[0];
  }
}

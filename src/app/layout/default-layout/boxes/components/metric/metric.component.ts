import { Component, OnInit, Input } from '@angular/core';
import { Metric } from "../../../../../core/shared/metric.model";

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  selector: 'ds-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss']
})
export class MetricComponent implements OnInit {

  /**
   * Current row configuration
   */
  @Input() metric: Metric;

  constructor() {}

  ngOnInit() {

  }

}

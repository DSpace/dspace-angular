import { Component, OnInit, Input } from '@angular/core';
import { MetricRow } from "../../metrics/cris-layout-metrics-box.component";

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ds-metric-row]',
  templateUrl: './metric-row.component.html',
  styleUrls: ['./metric-row.component.scss']
})
export class MetricRowComponent implements OnInit {

  /**
   * Current row configuration
   */
  @Input() metricRow: MetricRow;

  constructor() {}

  ngOnInit() {

  }

}

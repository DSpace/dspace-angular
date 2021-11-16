import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../core/layout/models/tab.model';

@Component({
  selector: 'ds-cris-layout-leading',
  templateUrl: './cris-layout-leading.component.html',
  styleUrls: ['./cris-layout-leading.component.scss']
})
export class CrisLayoutLeadingComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  /* tslint:disable:no-empty */
  constructor() { }

  ngOnInit(): void {
  }
  /* tslint:enable:no-empty */


}

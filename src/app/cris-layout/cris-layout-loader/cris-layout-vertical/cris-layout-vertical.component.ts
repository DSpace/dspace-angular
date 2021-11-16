import { Component, OnInit, OnChanges } from '@angular/core';
import { CrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { Tab } from '../../../core/layout/models/tab.model';
import { CrisLayoutTabsSidebarComponent } from '../shared/cris-layout-tabs/cris-layout-tabs.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss']
})
@CrisLayoutPage(LayoutPage.VERTICAL)
export class CrisLayoutVerticalComponent extends CrisLayoutTabsSidebarComponent implements OnInit {

  tabs: Tab[];

  constructor(public location: Location, public router: Router, public route: ActivatedRoute) {
    super(location,router,route);
  }

  ngOnInit(): void {
    this.init();
  }

}

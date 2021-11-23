import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';
import { Observable, of as observableOf } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { slideMobileNav } from '../../../../shared/animations/slide';
import { HostWindowService } from '../../../../shared/host-window.service';
import { CrisLayoutTabsSidebarComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-navbar',
  templateUrl: './cris-layout-navbar.component.html',
  styleUrls: ['./cris-layout-navbar.component.scss'],
  animations: [slideMobileNav]
})
export class CrisLayoutNavbarComponent extends CrisLayoutTabsSidebarComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  /**
   * Item that is being viewed
   */
  @Input() item: Item;
  
  menuCollapsed = true;

  constructor(
    public location: Location, 
    public router: Router, 
    public route: ActivatedRoute,
    public windowService: HostWindowService) {
    super(location,router,route);
  }

  ngOnInit(): void {
    this.init();
  }

  getTabSelected(tab) {
    console.log(tab);
  }

  toggleNavbar() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}

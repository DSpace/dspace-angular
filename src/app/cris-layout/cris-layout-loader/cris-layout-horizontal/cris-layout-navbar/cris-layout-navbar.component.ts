import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { slideMobileNav } from '../../../../shared/animations/slide';
import { HostWindowService } from '../../../../shared/host-window.service';
import { CrisLayoutTabsComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-navbar',
  templateUrl: './cris-layout-navbar.component.html',
  styleUrls: ['./cris-layout-navbar.component.scss'],
  animations: [slideMobileNav]
})
export class CrisLayoutNavbarComponent extends CrisLayoutTabsComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: CrisLayoutTab[];

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  @Input() showNav: boolean;

  menuCollapsed = true;

  /**
   * Item that is being viewed
   */
  @Output() selectedTabChange = new EventEmitter<CrisLayoutTab>();

  constructor(
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public windowService: HostWindowService) {
    super(location, router, route);
  }

  ngOnInit(): void {
    this.init();
  }

  emitSelected(selectedTab) {
    this.selectedTabChange.emit(selectedTab);
  }

  toggleNavbar() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}

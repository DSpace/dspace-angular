import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';
import { Observable, of as observableOf } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { slideMobileNav } from '../../../../shared/animations/slide';
import { HostWindowService } from '../../../../shared/host-window.service';

@Component({
  selector: 'ds-cris-layout-navbar',
  templateUrl: './cris-layout-navbar.component.html',
  styleUrls: ['./cris-layout-navbar.component.scss'],
  animations: [slideMobileNav]
})
export class CrisLayoutNavbarComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  menuCollapsed = true;

  /* tslint:disable:no-empty */
  constructor(public windowService: HostWindowService) { }

  ngOnInit(): void {
    this.windowService.isXsOrSm().pipe(
      take(1),
      tap( (val) => {
        this.menuCollapsed = val;
      })
    );
  }
  /* tslint:enable:no-empty */

  getTabSelected(tab) {
    console.log(tab);
  }

  toggleNavbar() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}

import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { Item } from '../../../../core/shared/item.model';
import { slideMobileNav } from '../../../../shared/animations/slide';
import { HostWindowService } from '../../../../shared/host-window.service';
import { CrisLayoutTabsComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';
import { CrisLayoutSidebarItemComponent } from '../../shared/sidebar-item/cris-layout-sidebar-item.component';

@Component({
  selector: 'ds-cris-layout-navbar',
  templateUrl: './cris-layout-navbar.component.html',
  styleUrls: ['./cris-layout-navbar.component.scss'],
  animations: [slideMobileNav],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    CrisLayoutSidebarItemComponent,
    AsyncPipe,
    TranslateModule,
  ],
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

  windowService = inject(HostWindowService);

  isXsOrSm$: Observable<boolean>;

  ngOnInit(): void {
    this.init();
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  emitSelected(selectedTab) {
    this.selectedTabChange.emit(selectedTab);
  }

  toggleNavbar() {
    this.menuCollapsed = !this.menuCollapsed;
  }
}

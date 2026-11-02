import {
  AsyncPipe,
  NgClass,
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

import { DynamicLayoutTab } from '../../../../core/layout/models/tab.model';
import { Item } from '../../../../core/shared/item.model';
import { slideMobileNav } from '../../../../shared/animations/slide';
import { HostWindowService } from '../../../../shared/host-window.service';
import { DynamicLayoutTabsComponent } from '../../shared/dynamic-layout-tabs/dynamic-layout-tabs.component';
import { DynamicLayoutSidebarItemComponent } from '../../shared/sidebar-item/dynamic-layout-sidebar-item.component';

@Component({
  selector: 'ds-dynamic-layout-navbar',
  templateUrl: './dynamic-layout-navbar.component.html',
  styleUrls: ['./dynamic-layout-navbar.component.scss'],
  animations: [slideMobileNav],
  imports: [
    AsyncPipe,
    DynamicLayoutSidebarItemComponent,
    NgClass,
    TranslateModule,
  ],
})
export class DynamicLayoutNavbarComponent extends DynamicLayoutTabsComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: DynamicLayoutTab[];

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  @Input() showNav: boolean;

  menuCollapsed = true;

  /**
   * Item that is being viewed
   */
  @Output() selectedTabChange = new EventEmitter<DynamicLayoutTab>();

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

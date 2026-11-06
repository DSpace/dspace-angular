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
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HostWindowService } from '../../../../shared/host-window.service';
import { DynamicLayoutTabsComponent } from '../../shared/dynamic-layout-tabs/dynamic-layout-tabs.component';
import { DynamicLayoutSidebarItemComponent } from '../../shared/sidebar-item/dynamic-layout-sidebar-item.component';

@Component({
  selector: 'ds-dynamic-layout-navbar',
  templateUrl: './dynamic-layout-navbar.component.html',
  styleUrls: ['./dynamic-layout-navbar.component.scss'],
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

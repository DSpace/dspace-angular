import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { rotate, rotateNavbar } from '../../../../shared/animations/rotate';
import { slide } from '../../../../shared/animations/slide';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component defines the default layout for all tabs of DSpace Items.
 * This component can be overwritten for a specific Item type using
 * CrisLayoutTabModelComponent decorator
 */
@Component({
  selector: 'ds-cris-layout-sidebar-item',
  templateUrl: './cris-layout-sidebar-item.component.html',
  styleUrls: ['./cris-layout-sidebar-item.component.scss'],
  animations: [rotate, slide, rotateNavbar]
})
export class CrisLayoutSidebarItemComponent {
  /**
   * The tab that will be shown
   */
  @Input() tab: CrisLayoutTab;

  /**
   * used for notify tab selection
   */
  @Input() selectedTab: CrisLayoutTab;

  /**
   * used for specifying type of layout
   */
  @Input() layout: string;

  /**
   * The prefix used for box header's i18n key
   */
  tabI18nPrefix = 'layout.tab.header.';

  /**
   * used for notify tab selection
   */
  @Output() tabSelectedChange = new EventEmitter<CrisLayoutTab>();

  /**
   * Emits true when the menu section is expanded, else emits false
   * This is true when the section is active AND either the sidebar or it's preview is open
   */
  expanded = false;

  constructor(protected translateService: TranslateService) {
  }

  ngOnInit() {
    if (this.tab.isActive) {
      this.tabSelectedChange.emit(this.tab);
    }
    if (!!this.tab && !!this.tab.children && this.tab.children.length > 0) {
      this.tab.children.forEach((subtab) => {
        if (subtab.isActive) {
          if (this.layout !== 'horizontal') {
            this.expanded = true;
          }
          this.tab.isActive = true;
          this.tabSelectedChange.emit(subtab);
          return;
        }
      });
    }
  }

  getTabHeader(tab: CrisLayoutTab): string {
    const tabHeaderI18nKey = this.tabI18nPrefix + tab.shortname;
    const header: string = this.translateService.instant(tabHeaderI18nKey);
    if (header === tabHeaderI18nKey ) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(tab.header || header);
    } else {
      return header;
    }
  }

  toggleSection(event): void {
    this.expanded = !this.expanded;
  }

  selectTab(tab): void {
    this.tabSelectedChange.emit(tab);
  }

}

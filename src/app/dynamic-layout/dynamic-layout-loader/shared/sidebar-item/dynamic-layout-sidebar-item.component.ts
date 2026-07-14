import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { TranslateService } from '@ngx-translate/core';

import {
  rotate,
  rotateNavbar,
} from '../../../../shared/animations/rotate';
import { slide } from '../../../../shared/animations/slide';

/**
 * This component defines the default layout for all tabs of DSpace Items.
 * This component can be overwritten for a specific Item type using
 * DynamicLayoutTabModelComponent decorator
 */
@Component({
  selector: 'ds-dynamic-layout-sidebar-item',
  templateUrl: './dynamic-layout-sidebar-item.component.html',
  styleUrls: ['./dynamic-layout-sidebar-item.component.scss'],
  animations: [rotate, slide, rotateNavbar],
  imports: [
    NgClass,
    RouterLink,
  ],
})
export class DynamicLayoutSidebarItemComponent implements OnInit {
  /**
   * Contains the items base url
   */
  @Input() itemBaseUrl: string;

  /**
   * The tab that will be shown
   */
  @Input() tab: DynamicLayoutTab;

  /**
   * used for notify tab selection
   */
  @Input() selectedTab: DynamicLayoutTab;

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
  @Output() tabSelectedChange = new EventEmitter<DynamicLayoutTab>();


  @Input() activeTab: DynamicLayoutTab;

  /**
   * Emits true when the menu section is expanded, else emits false
   * This is true when the section is active AND either the sidebar or it's preview is open
   */
  expanded = false;

  constructor(protected translateService: TranslateService) {
  }

  ngOnInit() {
    if (!!this.tab && !!this.tab.children && this.tab.children.length > 0) {
      this.tab.isActive = false;
      this.expanded = false;
      this.tab.children.forEach((subtab) => {
        if (subtab.id === this.activeTab.id) {
          if (this.layout !== 'horizontal') {
            this.expanded = true;
          }
          this.tab.isActive = true;
          return;
        }
      });
    }
  }

  /**
   * get the translation for the i18n key
   * @param key the i18n key
   */
  getTranslation(key: string): string {
    const value = this.translateService.instant(key);
    return value === key ? null : value;
  }

  getTabHeader(tab: DynamicLayoutTab): string {
    const tabHeaderI18nKey = this.tabI18nPrefix + this.tab.entityType + '.' + tab.shortname;
    const tabHeaderGenericI18nKey = this.tabI18nPrefix + tab.shortname;

    return this.getTranslation(tabHeaderI18nKey) ??
      this.getTranslation(tabHeaderGenericI18nKey) ??
        this.getTranslation(tab.header) ??
          tab.header ??
            '';
  }

  toggleSection(event): void {
    this.expanded = !this.expanded;
  }

  selectTab(tab): void {
    this.tabSelectedChange.emit(tab);
  }

}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';

import { Tab } from '../../../core/layout/models/tab.model';
import { hasValue } from '../../../shared/empty.util';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../core/shared/item.model';

/**
 * This component render the sidebar of the default layout
 */
@Component({
  selector: 'ds-cris-layout-default-sidebar',
  templateUrl: './cris-layout-default-sidebar.component.html',
  styleUrls: ['./cris-layout-default-sidebar.component.scss']
})
export class CrisLayoutDefaultSidebarComponent implements OnChanges {

  /**
   * The item object related to the page
   */
  @Input() item: Item;
  /**
   * Representing if sidebar should be displayed or not
   */
  @Input() sidebarActive: boolean;
  /**
   * hide/show the sidebar
   */
  @Input() sidebarStatus: boolean;
  /**
   * tabs list
   */
  @Input() tabs: Tab[];
  /**
   * used for notify tab selection
   */
  @Output() selectedTab = new EventEmitter<Tab>();

  constructor(private location: Location, private router: Router, private route: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabs && changes.tabs.currentValue) {
      // Check if the location contains a specific tab to show
      const tabName = this.getCurrentTabFromUrl();
      if (hasValue(tabName)) {
        let idx = 0;
        for (const tab of this.tabs) {
          if (tab.shortname === tabName) {
            this.selectTab(idx);
            return;
          }
          idx++;
        }
        if (idx === this.tabs.length) {
          this.selectTab(0);
        }
      } else {
        this.selectTab(0);
      }
    }
  }

  /**
   * This method selects new tab, change the location with its shortname and
   * notify the change at parent component
   * @param idx id of tab
   */
  selectTab(idx: number) {
    this.tabs.forEach((tab) => {
      tab.isActive = false;
    });
    this.tabs[idx].isActive = true;
    const tabName = this.getCurrentTabFromUrl();
    if (tabName) {
      if (tabName === this.item.uuid) {
        this.router.navigate([this.tabs[idx].shortname], {replaceUrl: true, relativeTo: this.route});
      } else if (tabName !== this.tabs[idx].shortname) {
        this.router.navigate(['../', this.tabs[idx].shortname], {replaceUrl: true, relativeTo: this.route});
      }
    }
    // Notify selected tab at parent
    this.selectedTab.emit(this.tabs[idx]);
  }

  private getCurrentTabFromUrl() {
    let currentTab = null;
    const locationParts = this.location.path().split('/');
    if (locationParts) {
      const lastPart = locationParts.pop();
      currentTab = lastPart;
      if (lastPart.includes('?')) {
        const paramsParts = lastPart.split('?');
        currentTab = paramsParts[0];
      }
    }
    return currentTab;
  }
}

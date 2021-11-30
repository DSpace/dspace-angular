import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';

import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { hasValue } from '../../../../shared/empty.util';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../core/shared/item.model';

/**
 * This component render the sidebar of the tabs layout
 */
@Component({
  selector: 'ds-cris-layout-tabs-sidebar',
  template: ''
})
export class CrisLayoutTabsComponent {

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
  tabs: CrisLayoutTab[] = [];
  /**
   * used for notify tab selection
   */
  @Output() selectedTab = new EventEmitter<CrisLayoutTab>();

  constructor(public location: Location, public router: Router, public route: ActivatedRoute) {
  }

  init(): void {
    if ( this.tabs && this.tabs.length > 0 ) {
      this.parseTabs();
      // Check if the location contains a specific tab to show
      const tabName = this.getCurrentTabFromUrl();
      if (hasValue(tabName)) {
        this.selectFromTabName(tabName);
      } else {
        if (this.tabs[0].children && this.tabs[0].children.length > 0) {
          this.selectTab(0,0);
        } else {
          this.selectTab(0,null);
        }
      }
    }
  }

  selectFromTabName(tabName): void {
    let result = null;
    this.tabs.forEach( (tab,i) => {
      if (!!tab.children && tab.children.length > 0) {
        tab.children.forEach( (subtab,j) => {
          if (subtab.shortname === tabName) {
            result = [i,j];
            this.selectTab(i,j);
            return;
          }
        });
      } else {
        if (tab.shortname === tabName) {
          result = [i,null];
          this.selectTab(i,null);
          return;
        }
      }
    });
    if (result == null) {
      if (this.tabs[0].children && this.tabs[0].children.length > 0) {
        this.selectTab(0,0);
      } else {
        this.selectTab(0,null);
      }
    }
  }

  /**
   * This method selects new tab, change the location with its shortname and
   * notify the change at parent component
   * @param idx id of tab
   * @param idy id of nested tab
   */
  selectTab(idx: number,idy?: number) {
    this.tabs.forEach((tabElm) => {
      tabElm.isActive = false;
      if (!!tabElm.children && tabElm.children.length > 0) {
        tabElm.children.forEach((subtab,j) => {
          subtab.isActive = false;
        });
      }
    });
    let selectedTab = null;
    if (idy != null) {
      selectedTab = this.tabs[idx].children[idy];
      this.tabs[idx].children[idy].isActive = true;
    } else {
      selectedTab = this.tabs[idx];
      this.tabs[idx].isActive = true;
    }
    const tabName = this.getCurrentTabFromUrl();
    if (tabName) {
      if (tabName === this.item.uuid) {
        this.router.navigate(
          [selectedTab.shortname],
          {
            replaceUrl: true,
            relativeTo: this.route
          });
      } else if (tabName !== selectedTab.shortname) {
        this.router.navigate(
          ['../', selectedTab.shortname],
          {
            replaceUrl: true,
            relativeTo: this.route
          });
      }
    }
    // Notify selected tab at parent
    this.selectedTab.emit(selectedTab);
  }

  public getCurrentTabFromUrl() {
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

  public parseTabs(): void {
      const tabs = [];
      this.tabs.forEach((tab) => {
          // create children where tab has "::"
          if (tab.shortname.includes('::')) {
            const splitedTabs = tab.shortname.split('::');
            const splitedHeaderTabs = tab.header.split('::');
            const previousTab = tabs.find((seltab) => seltab.shortname === splitedTabs[0]);

            if (!previousTab) {
              const parentTab = Object.assign({},tab);
              parentTab.header = splitedHeaderTabs[0];
              parentTab.shortname = splitedTabs[0];
              const childTab = Object.assign(tab,{
                header:splitedHeaderTabs[1],
                shortname:splitedTabs[1]
              });
              parentTab.children = [];
              parentTab.children.push(childTab);
              tabs.push(parentTab);
            } else {
              tab.header = splitedHeaderTabs[1];
              tab.shortname = splitedTabs[1];
              previousTab.children.push(tab);
            }
          } else {
            tabs.push(tab);
          }
      });
      this.tabs = tabs;
  }

  getTabSelected(tab) {
    this.selectFromTabName(tab.shortname);
  }


}

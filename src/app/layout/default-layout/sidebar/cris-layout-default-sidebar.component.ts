import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';

import { Tab } from '../../../core/layout/models/tab.model';
import { hasValue } from '../../../shared/empty.util';

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

  constructor(private location: Location) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabs && changes.tabs.currentValue) {
      // Check if the location contains a specific tab to show
      const tks = this.location.path().split('/');
      if (hasValue(tks)) {
        const tabName = tks[tks.length - 1];
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
      } else {
        this.selectTab(0);
      }
    }
  }

  /**
   * This metod selects new tab, change the location with its shortname and
   * notify the change at parent component
   * @param idx id of tab
   */
  selectTab(idx: number) {
    this.tabs.forEach((tab) => {
      tab.isActive = false;
    });
    this.tabs[idx].isActive = true;
    const tks = this.location.path().split('/');
    let newLocation = '';
    if (tks) {
      for (let i = 1; i < 3; i++) {
        newLocation += '/' + tks[i];
      }
      newLocation += '/' + this.tabs[idx].shortname;
      this.location.replaceState(newLocation);
    }
    // Notify selected tab at parent
    this.selectedTab.emit(this.tabs[idx]);
  }

}

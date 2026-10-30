import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Item } from '@dspace/core/shared/item.model';
import { isNotNull } from '@dspace/shared/utils/empty.util';
import { BehaviorSubject } from 'rxjs';

/**
 * This component render the sidebar of the tabs layout
 */
@Component({
  selector: 'ds-dynamic-layout-tabs-sidebar',
  template: '',
})
export abstract class DynamicLayoutTabsComponent {

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
  tabs: DynamicLayoutTab[] = [];


  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public activeTab$ = new BehaviorSubject<DynamicLayoutTab>(undefined);


  /**
   * used for notify tab selection
   */
  @Output() selectedTab = new EventEmitter<DynamicLayoutTab>();

  /**
   * The item base url
   */
  itemBaseUrl: string;

  location = inject(Location);
  route = inject(ActivatedRoute);
  router = inject(Router);

  init(): void {
    this.itemBaseUrl = getItemPageRoute(this.item) + '/';
    if (this.tabs && this.tabs.length > 0) {
      if (isNotNull(this.route.snapshot.paramMap.get('tab'))) {
        this.parseTabs(this.route.snapshot.paramMap.get('tab'));
      } else {
        this.parseTabs(this.tabs[0].shortname);
      }
    }
  }

  public parseTabs(shortname): void {
    const tabs = [];
    this.tabs.forEach((tab) => {
      // create children where tab has "::"
      if (tab.shortname.includes('::')) {
        const splitedTabs = tab.shortname.split('::');
        const splitedHeaderTabs = tab.header.split('::');
        const previousTab = tabs.find((seltab) => seltab.shortname === splitedTabs[0]);

        if (!previousTab) {
          const parentTab = Object.assign({}, tab);
          parentTab.header = splitedHeaderTabs[0];
          parentTab.shortname = splitedTabs[0];
          const childTab = Object.assign(tab, {
            header: splitedHeaderTabs[1],
            shortname: splitedTabs[1],
          });
          parentTab.children = [];
          parentTab.children.push(childTab);
          tabs.push(parentTab);
          if (shortname === parentTab.shortname) {
            this.setActiveTab(parentTab);
          }
          if (shortname === childTab.shortname) {
            this.setActiveTab(childTab);
          }
        } else {
          tab.header = splitedHeaderTabs[1];
          tab.shortname = splitedTabs[1];
          previousTab.children.push(tab);
        }
        if (shortname === tab.shortname) {
          this.setActiveTab(tab);
        }
      } else {
        tabs.push(tab);
        if (shortname === tab.shortname) {
          this.setActiveTab(tab);
        }
      }
    });
    this.tabs = tabs;
  }

  abstract emitSelected(selectedTab): void;

  setActiveTab(tab) {
    this.activeTab$.next(tab);
    this.emitSelected(tab);
  }

  navigateToTab(tab: DynamicLayoutTab): void {
    this.activeTab$.next(tab);
    const itemPageRoute = (getItemPageRoute(this.item) + '/' + tab.shortname);
    this.router.navigateByUrl(itemPageRoute, { onSameUrlNavigation: 'ignore' }).then(() => {
      this.location.replaceState(itemPageRoute);
    });
  }
}

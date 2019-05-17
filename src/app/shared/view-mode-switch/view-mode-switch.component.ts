import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { SearchService } from '../../+search-page/search-service/search.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { isEmpty } from '../empty.util';

/**
 * Component to switch between list and grid views.
 */
@Component({
  selector: 'ds-view-mode-switch',
  styleUrls: ['./view-mode-switch.component.scss'],
  templateUrl: './view-mode-switch.component.html'
})
export class ViewModeSwitchComponent implements OnInit, OnDestroy {
  @Input() viewModeList: ViewMode[];

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  currentMode: ViewMode = ViewMode.List;
  viewModeEnum = ViewMode;
  private sub: Subscription;

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    if (isEmpty(this.viewModeList)) {
      this.viewModeList = [ViewMode.List, ViewMode.Grid];
    }

    this.sub = this.searchService.getViewMode().subscribe((viewMode: ViewMode) => {
      this.currentMode = viewMode;
    });
  }

  switchViewTo(viewMode: ViewMode) {
    this.searchService.setViewMode(viewMode, this.getSearchLinkParts());
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  isToShow(viewMode: ViewMode) {
    return this.viewModeList && this.viewModeList.includes(viewMode);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return './';
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.searchService) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

}

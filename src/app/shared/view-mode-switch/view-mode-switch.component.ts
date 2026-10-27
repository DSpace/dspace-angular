
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import {
  isEmpty,
  isNotEmpty,
} from '../empty.util';
import { BrowserOnlyPipe } from '../utils/browser-only.pipe';
import { currentPath } from '../utils/route.utils';

/**
 * Component to switch between list and grid views.
 */
@Component({
  selector: 'ds-view-mode-switch',
  styleUrls: ['./view-mode-switch.component.scss'],
  templateUrl: './view-mode-switch.component.html',
  imports: [
    BrowserOnlyPipe,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
  ],
})
export class ViewModeSwitchComponent implements OnInit, OnDestroy {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * List of available view mode
   */
  @Input() viewModeList: ViewMode[];

  /**
   * The current view mode
   */
  currentMode: ViewMode = ViewMode.ListElement;

  /**
   * All available view modes
   */
  viewModeEnum = ViewMode;

  /**
   * Subscription to unsubscribe OnDestroy
   * @private
   */
  private sub: Subscription;

  /**
   * Emits event when the user select a new view mode
   */
  @Output() changeViewMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  constructor(private searchService: SearchService,
              private router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) private searchConfigurationService: SearchConfigurationService) {
  }

  /**
   * Initialize the instance variables
   */
  ngOnInit(): void {
    if (isEmpty(this.viewModeList)) {
      this.viewModeList = [ViewMode.ListElement, ViewMode.GridElement];
      if (environment.geospatialMapViewer.enableSearchViewMode) {
        this.viewModeList.push(ViewMode.GeospatialMap);
      }
    }

    this.sub = this.searchConfigurationService.getCurrentViewMode(ViewMode.ListElement).pipe(
      filter((viewMode: ViewMode) => isNotEmpty(viewMode)),
    ).subscribe((viewMode: ViewMode) => {
      this.currentMode = viewMode;
    });
  }

  /**
   * Switch view modes
   * @param viewMode The new view mode
   */
  switchViewTo(viewMode: ViewMode) {
    if (viewMode !== this.currentMode) {
      this.changeViewMode.emit(viewMode);
    }
    this.searchConfigurationService.setViewMode(viewMode, this.getSearchLinkParts());
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Whether or not to show a certain view mode
   * @param viewMode The view mode to check for
   */
  isToShow(viewMode: ViewMode) {
    return this.viewModeList && this.viewModeList.includes(viewMode);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
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

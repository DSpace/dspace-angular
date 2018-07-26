import { Component, Input, OnInit } from '@angular/core';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchFilterService } from './search-filter.service';
import { Observable } from 'rxjs/Observable';
import { slide } from '../../../shared/animations/slide';
import { isNotEmpty } from '../../../shared/empty.util';

@Component({
  selector: 'ds-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
  animations: [slide],
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class SearchFilterComponent implements OnInit {
  /**
   * The filter config for this component
   */
  @Input() filter: SearchFilterConfig;

  /**
   * True when the filter is 100% collapsed in the UI
   */
  collapsed;

  constructor(private filterService: SearchFilterService) {
  }

  /**
   * Requests the current set values for this filter
   * If the filter config is open by default OR the filter has at least one value, the filter should be initially expanded
   * Else, the filter should initially be collapsed
   */
  ngOnInit() {
    this.getSelectedValues().first().subscribe((isActive) => {
      if (this.filter.isOpenByDefault || isNotEmpty(isActive)) {
        this.initialExpand();
      } else {
        this.initialCollapse();
      }
    });
  }

  /**
   *  Changes the state for this filter to collapsed when it's expanded and to expanded it when it's collapsed
   */
  toggle() {
    this.filterService.toggle(this.filter.name);
  }

  /**
   * Checks if the filter is currently collapsed
   * @returns {Observable<boolean>} Emits true when the current state of the filter is collapsed, false when it's expanded
   */
  isCollapsed(): Observable<boolean> {
    return this.filterService.isCollapsed(this.filter.name);
  }

  /**
   *  Changes the initial state to collapsed
   */
  initialCollapse() {
    this.filterService.initialCollapse(this.filter.name);
    this.collapsed = true;
  }

  /**
   *  Changes the initial state to expanded
   */
  initialExpand() {
    this.filterService.initialExpand(this.filter.name);
    this.collapsed = false;
  }

  /**
   * @returns {Observable<string[]>} Emits a list of all values that are currently active for this filter
   */
  getSelectedValues(): Observable<string[]> {
    return this.filterService.getSelectedValuesForFilter(this.filter);
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.collapsed = false;
    }
  }

  /**
   * Method to change this.collapsed to true when the slide animation starts and is sliding closed
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.collapsed = true;
    }
  }
}

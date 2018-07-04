import { Component, Input, OnInit } from '@angular/core';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { SearchFilterService } from './search-filter.service';
import { Observable } from 'rxjs/Observable';
import { slide } from '../../../shared/animations/slide';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
  animations: [slide],
})

export class SearchFilterComponent implements OnInit {
  @Input() filter: SearchFilterConfig;
  collapsed;

  constructor(private filterService: SearchFilterService) {
  }

  ngOnInit() {
    this.filterService.isFilterActive(this.filter.paramName).first().subscribe((isActive) => {
      if (this.filter.isOpenByDefault || isActive) {
        this.initialExpand();
      } else {
        this.initialCollapse();
      }
    });
  }

  toggle() {
    this.filterService.toggle(this.filter.name);
  }

  isCollapsed(): Observable<boolean> {
    return this.filterService.isCollapsed(this.filter.name);
  }

  initialCollapse() {
    this.filterService.initialCollapse(this.filter.name);
    this.collapsed = true;
  }

  initialExpand() {
    this.filterService.initialExpand(this.filter.name);
    this.collapsed = false;
  }

  getSelectedValues(): Observable<string[]> {
    return this.filterService.getSelectedValuesForFilter(this.filter);
  }

  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.collapsed = false;
    }
  }

  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.collapsed = true;
    }
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SidebarFilterService } from './sidebar-filter.service';
import { slide } from '../../animations/slide';

@Component({
  selector: 'ds-sidebar-filter',
  styleUrls: ['./sidebar-filter.component.scss'],
  templateUrl: './sidebar-filter.component.html',
  animations: [slide],
})
/**
 * This components renders a sidebar filter including the label and the selected values.
 * The filter input itself should still be provided in the content.
 */
export class SidebarFilterComponent implements OnInit {

  @Input() name: string;
  @Input() type: string;
  @Input() label: string;
  @Input() expanded = true;
  @Input() singleValue = false;
  @Input() selectedValues: Observable<string[]>;
  @Output() removeValue: EventEmitter<any> = new EventEmitter<any>();

  /**
   * True when the filter is 100% collapsed in the UI
   */
  closed = true;

  /**
   * Emits true when the filter is currently collapsed in the store
   */
  collapsed$: Observable<boolean>;

  constructor(
    protected filterService: SidebarFilterService,
  ) {
  }

  /**
   *  Changes the state for this filter to collapsed when it's expanded and to expanded it when it's collapsed
   */
  toggle() {
    this.filterService.toggle(this.name);
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.closed = false;
    }
  }

  /**
   * Method to change this.collapsed to true when the slide animation starts and is sliding closed
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.closed = true;
    }
  }

  ngOnInit(): void {
    this.closed = !this.expanded;
    this.initializeFilter();
    this.collapsed$ = this.isCollapsed();
  }

  /**
   *  Sets the initial state of the filter
   */
  initializeFilter() {
    this.filterService.initializeFilter(this.name, this.expanded);
  }

  /**
   * Checks if the filter is currently collapsed
   * @returns {Observable<boolean>} Emits true when the current state of the filter is collapsed, false when it's expanded
   */
  private isCollapsed(): Observable<boolean> {
    return this.filterService.isCollapsed(this.name);
  }

}

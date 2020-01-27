import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-sidebar-filter-selected-option',
  styleUrls: ['./sidebar-filter-selected-option.component.scss'],
  templateUrl: './sidebar-filter-selected-option.component.html',
})

/**
 * Represents a single selected option in a sidebar filter
 */
export class SidebarFilterSelectedOptionComponent {
  @Input() label: string;
  @Output() click: EventEmitter<any> = new EventEmitter<any>();
}

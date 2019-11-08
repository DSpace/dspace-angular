import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-sidebar-dropdown',
  styleUrls: ['./sidebar-dropdown.component.scss'],
  templateUrl: './sidebar-dropdown.component.html',
})
export class SidebarDropdownComponent {
  @Input() id:string;
  @Input() label:string;
  @Output() change:EventEmitter<any> = new EventEmitter<number>();
}

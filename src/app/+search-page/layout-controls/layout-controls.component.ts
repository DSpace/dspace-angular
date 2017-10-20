import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-layout-controls',
  styleUrls: ['./layout-controls.component.scss'],
  templateUrl: './layout-controls.component.html',
})

export class LayoutControlsComponent {
  @Input() isList = true;
  @Output() toggleList = new EventEmitter<boolean>();

  setList(isList: boolean) {
    this.isList = isList;
    this.toggleList.emit(isList);
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-item-page-field-wrapper',
  styleUrls: ['./item-page-field-wrapper.component.css'],
  templateUrl: './item-page-field-wrapper.component.html'
})
export class ItemPageFieldWrapperComponent {

  @Input() label: string;
  constructor() {
    this.universalInit();

  }

  universalInit() {

  }

}

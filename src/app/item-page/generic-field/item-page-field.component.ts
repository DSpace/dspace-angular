import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-item-page-field',
  styleUrls: ['./item-page-field.component.css'],
  templateUrl: './item-page-field.component.html'
})
export class ItemPageFieldComponent {

  @Input() data: any;
  @Input() separator: string;
  @Input() label: string;

  constructor() {
    this.universalInit();

  }

  universalInit() {

  }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-metadata-field-wrapper',
  styleUrls: ['./metadata-field-wrapper.component.css'],
  templateUrl: './metadata-field-wrapper.component.html'
})
export class MetadataFieldWrapperComponent {

  @Input() label: string;
  constructor() {
    this.universalInit();

  }

  universalInit() {

  }

}

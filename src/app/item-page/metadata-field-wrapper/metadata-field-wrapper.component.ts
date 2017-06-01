import { Component, Input } from '@angular/core';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */

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

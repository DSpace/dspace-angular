import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-metadata-values',
  styleUrls: ['./metadata-values.component.css'],
  templateUrl: './metadata-values.component.html'
})
export class MetadataValuesComponent {

  @Input() values: any;
  @Input() separator: string;
  @Input() label: string;

  constructor() {
    this.universalInit();

  }

  universalInit() {

  }

}

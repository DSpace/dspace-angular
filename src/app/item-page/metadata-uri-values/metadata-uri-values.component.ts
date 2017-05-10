import { Component, Input } from '@angular/core';
import { MetadataValuesComponent } from "../metadata-values/metadata-values.component";

@Component({
  selector: 'ds-metadata-uri-values',
  styleUrls: ['./metadata-uri-values.component.css'],
  templateUrl: './metadata-uri-values.component.html'
})
export class MetadataUriValuesComponent extends MetadataValuesComponent {

  @Input() linktext: any;

  @Input() values: any;

  @Input() separator: string;

  @Input() label: string;
}

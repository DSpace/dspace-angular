import { Component, Input } from '@angular/core';
import { Metadata } from './../../../../core/submission/models/sherpa-policies-details.model';

@Component({
  selector: 'ds-metadata-information',
  templateUrl: './metadata-information.component.html',
  styleUrls: ['./metadata-information.component.scss']
})
export class MetadataInformationComponent {

  @Input() metadata: Metadata;

}

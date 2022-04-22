import { PermittedVersions } from './../../../../core/submission/models/sherpa-policies-details.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-content-accordion',
  templateUrl: './content-accordion.component.html',
  styleUrls: ['./content-accordion.component.scss']
})
export class ContentAccordionComponent {

  @Input() version: PermittedVersions;

}

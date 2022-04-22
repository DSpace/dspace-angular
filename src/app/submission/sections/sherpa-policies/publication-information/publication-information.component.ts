import { Component, Input, OnInit } from '@angular/core';
import { Journal } from './../../../../core/submission/models/sherpa-policies-details.model';

@Component({
  selector: 'ds-publication-information',
  templateUrl: './publication-information.component.html',
  styleUrls: ['./publication-information.component.scss']
})
export class PublicationInformationComponent {

  @Input() journal: Journal;

}

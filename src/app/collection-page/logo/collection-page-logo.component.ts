import { Component, Input } from '@angular/core';

import { Bitstream } from "../../core/shared/bitstream.model";


@Component({
  selector: 'ds-collection-page-logo',
  styleUrls: ['./collection-page-logo.component.css'],
  templateUrl: './collection-page-logo.component.html',
})
export class CollectionPageLogoComponent {
  @Input() logo: Bitstream;
}

import { Component, Input } from '@angular/core';

import { Bitstream } from "../../core/shared/bitstream.model";


@Component({
  selector: 'ds-dso-logo',
  styleUrls: ['./dso-logo.component.css'],
  templateUrl: './dso-logo.component.html',
})
export class DsoLogoComponent {
  @Input() logo: Bitstream;

  @Input() alternateText: string;
}
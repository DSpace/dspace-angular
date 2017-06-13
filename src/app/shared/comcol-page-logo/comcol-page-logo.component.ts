import { Component, Input } from '@angular/core';

import { Bitstream } from "../../core/shared/bitstream.model";


@Component({
  selector: 'ds-comcol-page-logo',
  styleUrls: ['./comcol-page-logo.component.css'],
  templateUrl: './comcol-page-logo.component.html',
})
export class ComcolPageLogoComponent {
  @Input() logo: Bitstream;

  @Input() alternateText: string;
}
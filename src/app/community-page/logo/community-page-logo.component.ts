import { Component, Input } from '@angular/core';

import { Bitstream } from "../../core/shared/bitstream.model";


@Component({
  selector: 'ds-community-page-logo',
  styleUrls: ['./community-page-logo.component.css'],
  templateUrl: './community-page-logo.component.html',
})
export class CommunityPageLogoComponent {
  @Input() logo: Bitstream;
}

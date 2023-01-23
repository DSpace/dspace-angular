import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent {
  @Input() object: DSpaceObject;
}

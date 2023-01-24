import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { MyDspaceItemStatusType } from './my-dspace-status-badge/my-dspace-item-status-type';

@Component({
  selector: 'ds-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent {
  @Input() object: DSpaceObject;
  @Input() myDSpaceStatus?: MyDspaceItemStatusType;
}

import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../core/shared/community.model';
import { ObjectGridElementComponent } from '../object-grid-element/object-grid-element.component';
import { gridElementFor} from '../grid-element-decorator';

@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@gridElementFor(Community)
export class CommunityGridElementComponent extends ObjectGridElementComponent<Community> {}

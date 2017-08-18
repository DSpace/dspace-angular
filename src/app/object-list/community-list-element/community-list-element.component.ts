import { Component, Input } from '@angular/core';

import { Community } from '../../core/shared/community.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { listElementFor } from '../list-element-decorator';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['./community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html'
})

@listElementFor(Community)
export class CommunityListElementComponent extends ObjectListElementComponent {}

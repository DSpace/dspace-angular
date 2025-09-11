import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Community } from '../../../../../../app/core/shared/community.model';
import { Context } from '../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunityListElementComponent as BaseComponent } from '../../../../../../app/shared/object-list/community-list-element/community-list-element.component';

@Component({
  selector: 'ds-community-list-element',
  // styleUrls: ['./community-list-element.component.scss'],
  styleUrls: ['../../../../../../app/shared/object-list/community-list-element/community-list-element.component.scss'],
  // templateUrl: './community-list-element.component.html'
  templateUrl: '../../../../../../app/shared/object-list/community-list-element/community-list-element.component.html',
  standalone: true,
  imports: [
    RouterLink,
  ],
})
@listableObjectComponent(Community, ViewMode.ListElement, Context.Any, 'custom')
export class CommunityListElementComponent extends BaseComponent {
}

import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@renderElementsFor(Community, ViewMode.Grid)
export class CommunityGridElementComponent extends AbstractListableElementComponent<Community> {}

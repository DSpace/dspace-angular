import { Component } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@renderElementsFor(Community, ViewMode.Grid)
export class CommunityGridElementComponent extends AbstractListableElementComponent<Community> {}

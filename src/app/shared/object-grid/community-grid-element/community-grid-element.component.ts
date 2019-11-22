import { Component } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component representing a grid element for a community
 */
@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@listableObjectComponent(Community, ViewMode.GridElement)
export class CommunityGridElementComponent extends AbstractListableElementComponent<Community> {}

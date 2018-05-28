import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor} from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';

@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html'
})

@renderElementsFor(Community, SetViewMode.Grid)
export class CommunityGridElementComponent extends AbstractListableElementComponent<Community> {}

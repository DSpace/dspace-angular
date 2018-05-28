import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['./community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html'
})

@renderElementsFor(Community, SetViewMode.List)
export class CommunityListElementComponent extends AbstractListableElementComponent<Community> {}

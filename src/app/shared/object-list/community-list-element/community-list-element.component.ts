import { Component, Input, Inject } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../+search-page/search-options.model';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['./community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html'
})

@renderElementsFor(Community, ViewMode.List)
export class CommunityListElementComponent extends ObjectListElementComponent<Community> {}

import { Component } from '@angular/core';

import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ds-community-list-element',
    styleUrls: ['./community-list-element.component.scss'],
    templateUrl: './community-list-element.component.html',
    standalone: true,
    imports: [NgIf, RouterLink]
})
/**
 * Component representing a list element for a community
 */
@listableObjectComponent(Community, ViewMode.ListElement)
export class CommunityListElementComponent extends AbstractListableElementComponent<Community> {

  constructor(
    public dsoNameService: DSONameService,
  ) {
    super(dsoNameService);
  }

}

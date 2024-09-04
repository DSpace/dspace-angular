import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ProjectSearchResultListElementComponent } from '../search-result-list-elements/project/project-search-result-list-element.component';

@listableObjectComponent('Project', ViewMode.ListElement)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html',
  standalone: true,
  imports: [ProjectSearchResultListElementComponent],
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends AbstractListableElementComponent<Item> {
}

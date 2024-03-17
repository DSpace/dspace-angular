import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ProjectSearchResultGridElementComponent } from '../search-result-grid-elements/project/project-search-result-grid-element.component';

@listableObjectComponent('Project', ViewMode.GridElement)
@Component({
  selector: 'ds-project-grid-element',
  styleUrls: ['./project-grid-element.component.scss'],
  templateUrl: './project-grid-element.component.html',
  standalone: true,
  imports: [ProjectSearchResultGridElementComponent],
})
/**
 * The component for displaying a grid element for an item of the type Project
 */
export class ProjectGridElementComponent extends AbstractListableElementComponent<Item> {
}

import { Component } from '@angular/core';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ProjectSearchResultListElementComponent } from '../search-result-list-elements/project/project-search-result-list-element.component';

@listableObjectComponent('Project', ViewMode.ListElement)
@Component({
    selector: 'ds-project-list-element',
    styleUrls: ['./project-list-element.component.scss'],
    templateUrl: './project-list-element.component.html',
    standalone: true,
    imports: [ProjectSearchResultListElementComponent]
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends AbstractListableElementComponent<Item> {
}

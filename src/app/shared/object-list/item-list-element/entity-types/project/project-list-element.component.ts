import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('Project', ElementViewMode.SetElement)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html'
})

export class ProjectListElementComponent extends EntitySearchResultComponent {
}

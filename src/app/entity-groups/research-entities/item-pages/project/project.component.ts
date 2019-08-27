import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

@rendersItemType('Project', ItemViewMode.Full)
@Component({
  selector: 'ds-project',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Project
 */
export class ProjectComponent extends ItemComponent implements OnInit {
  /**
   * The contributors related to this project
   */
  contributors$: Observable<RemoteData<PaginatedList<MetadataRepresentation>>>;

  ngOnInit(): void {
    this.contributors$ = this.buildRepresentations('OrgUnit', 'project.contributor.other', 'isOrgUnitOfProject');
  }
}

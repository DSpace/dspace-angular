import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { MetadataRepresentationType } from '@dspace/core/shared/metadata-representation/metadata-representation.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';

@Component({
  selector: 'ds-project-item-metadata-list-element',
  templateUrl: './project-item-metadata-list-element.component.html',
  imports: [
    NgbTooltip,
    RouterLink,
    TruncatableComponent,
  ],
})
/**
 * The component for displaying an item of the type Project as a metadata field
 */
@metadataRepresentationComponent('Publication', MetadataRepresentationType.AuthorityControlled)
export class ProjectItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
  /**
   * Initialize instance variables
   *
   * @param dsoNameService
   */
  constructor(
    public dsoNameService: DSONameService,
  ) {
    super();
  }
}

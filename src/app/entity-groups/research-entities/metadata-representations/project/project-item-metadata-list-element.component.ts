import { Component } from '@angular/core';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';

@metadataRepresentationComponent('Project', MetadataRepresentationType.Item)
@Component({
    selector: 'ds-project-item-metadata-list-element',
    templateUrl: './project-item-metadata-list-element.component.html',
    standalone: true,
    imports: [TruncatableComponent, RouterLink, NgbTooltipModule]
})
/**
 * The component for displaying an item of the type Project as a metadata field
 */
export class ProjectItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
  /**
   * Initialize instance variables
   *
   * @param dsoNameService
   */
  constructor(
    public dsoNameService: DSONameService
  ) {
      super();
  }
}

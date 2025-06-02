import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';

@Component({
  selector: 'ds-org-unit-item-metadata-list-element',
  templateUrl: './org-unit-item-metadata-list-element.component.html',
  standalone: true,
  imports: [
    NgbTooltipModule,
    RouterLink,
    TruncatableComponent,
  ],
})
/**
 * The component for displaying an item of the type OrgUnit as a metadata field
 */
@metadataRepresentationComponent('OrgUnit', MetadataRepresentationType.Item)
export class OrgUnitItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
}

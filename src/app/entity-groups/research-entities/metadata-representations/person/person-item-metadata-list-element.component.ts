
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { OrcidBadgeAndTooltipComponent } from '../../../../shared/orcid-badge-and-tooltip/orcid-badge-and-tooltip.component';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';

@Component({
  selector: 'ds-person-item-metadata-list-element',
  templateUrl: './person-item-metadata-list-element.component.html',
  standalone: true,
  imports: [
    NgbTooltipModule,
    OrcidBadgeAndTooltipComponent,
    RouterLink,
    TruncatableComponent,
  ],
})
/**
 * The component for displaying an item of the type Person as a metadata field
 */
export class PersonItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
}

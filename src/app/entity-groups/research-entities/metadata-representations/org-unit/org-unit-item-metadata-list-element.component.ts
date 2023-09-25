import { Component } from '@angular/core';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';

@metadataRepresentationComponent('OrgUnit', MetadataRepresentationType.Item)
@Component({
    selector: 'ds-org-unit-item-metadata-list-element',
    templateUrl: './org-unit-item-metadata-list-element.component.html',
    standalone: true,
    imports: [TruncatableComponent, RouterLink, NgbTooltipModule]
})
/**
 * The component for displaying an item of the type OrgUnit as a metadata field
 */
export class OrgUnitItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ItemMetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ds-org-unit-item-metadata-list-element',
  templateUrl: './org-unit-item-metadata-list-element.component.html',
  imports: [
    NgbTooltipModule,
    RouterLink,
    TruncatableComponent,
  ],
})
/**
 * The component for displaying an item of the type OrgUnit as a metadata field
 */
export class OrgUnitItemMetadataListElementComponent extends ItemMetadataRepresentationListElementComponent {
  @ViewChild('descTemplate', { static: true }) descTemplate: TemplateRef<any>;
}

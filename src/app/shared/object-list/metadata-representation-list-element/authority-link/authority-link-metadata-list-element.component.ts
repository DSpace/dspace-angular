import {
  Component,
  OnInit,
} from '@angular/core';
import { MetadataRepresentationType } from '@dspace/core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '@dspace/core/shared/metadata-representation/metadatum/metadatum-representation.model';

import { MetadataLinkViewComponent } from '../../../metadata-link-view/metadata-link-view.component';
import { metadataRepresentationComponent } from '../../../metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';

@Component({
  selector: 'ds-authority-link-metadata-list-element',
  templateUrl: './authority-link-metadata-list-element.component.html',
  imports: [
    MetadataLinkViewComponent,
  ],
})
/**
 * A component for displaying MetadataRepresentation objects with authority in the form of a link
 * It will simply use the value retrieved from MetadataRepresentation.getValue() to display a link to the item
 */
@metadataRepresentationComponent('Publication', MetadataRepresentationType.AuthorityControlled)
@metadataRepresentationComponent('Person', MetadataRepresentationType.AuthorityControlled)
@metadataRepresentationComponent('OrgUnit', MetadataRepresentationType.AuthorityControlled)
@metadataRepresentationComponent('Project', MetadataRepresentationType.AuthorityControlled)
export class AuthorityLinkMetadataListElementComponent extends MetadataRepresentationListElementComponent implements OnInit {

  metadataValue: MetadatumRepresentation;

  ngOnInit() {
    this.metadataValue = this.mdRepresentation as MetadatumRepresentation;
  }
}

import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';

@Component({
  selector: 'ds-browse-link-metadata-list-element',
  templateUrl: './browse-link-metadata-list-element.component.html',
  standalone: true,
  imports: [NgIf, RouterLink],
})
/**
 * A component for displaying MetadataRepresentation objects in the form of plain text
 * It will simply use the value retrieved from MetadataRepresentation.getValue() to display as plain text
 */
export class BrowseLinkMetadataListElementComponent extends MetadataRepresentationListElementComponent {

}

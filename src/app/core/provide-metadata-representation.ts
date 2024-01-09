import {
  BrowseLinkMetadataListElementComponent
} from '../shared/object-list/metadata-representation-list-element/browse-link/browse-link-metadata-list-element.component';
import {
  ExportMetadataSelectorComponent
} from '../shared/dso-selector/modal-wrappers/export-metadata-selector/export-metadata-selector.component';
import {
  ItemMetadataListElementComponent
} from '../shared/object-list/metadata-representation-list-element/item/item-metadata-list-element.component';
import {
  ItemMetadataRepresentationListElementComponent
} from '../shared/object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import {
  MetadataRepresentationListElementComponent
} from '../shared/object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import {
  OrgUnitItemMetadataListElementComponent
} from '../entity-groups/research-entities/metadata-representations/org-unit/org-unit-item-metadata-list-element.component';
import {
  PersonItemMetadataListElementComponent
} from '../entity-groups/research-entities/metadata-representations/person/person-item-metadata-list-element.component';
import {
  PlainTextMetadataListElementComponent
} from '../shared/object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';
import {
  ProjectItemMetadataListElementComponent
} from '../entity-groups/research-entities/metadata-representations/project/project-item-metadata-list-element.component';


/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const metadataRepresentations =
  [
    BrowseLinkMetadataListElementComponent,
    ExportMetadataSelectorComponent,
    ItemMetadataListElementComponent,
    ItemMetadataRepresentationListElementComponent,
    MetadataRepresentationListElementComponent,
    OrgUnitItemMetadataListElementComponent,
    PersonItemMetadataListElementComponent,
    PlainTextMetadataListElementComponent,
    ProjectItemMetadataListElementComponent,
  ];

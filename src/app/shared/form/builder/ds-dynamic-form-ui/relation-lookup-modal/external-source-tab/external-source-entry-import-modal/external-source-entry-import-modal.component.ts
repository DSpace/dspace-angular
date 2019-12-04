import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceEntry } from '../../../../../../../core/shared/external-source-entry.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { Metadata } from '../../../../../../../core/shared/metadata.utils';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../../../search/search-result.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { RelationshipOptions } from '../../../../models/relationship-options.model';
import { LookupRelationService } from '../../../../../../../core/data/lookup-relation.service';
import { PaginatedSearchOptions } from '../../../../../../search/paginated-search-options.model';
import { CollectionElementLinkType } from '../../../../../../object-collection/collection-element-link.type';
import { Context } from '../../../../../../../core/shared/context.model';
import { SelectableListService } from '../../../../../../object-list/selectable-list/selectable-list.service';

/**
 * The possible types of import for the external entry
 */
export enum ImportType {
  None = 'None',
  LocalEntity = 'LocalEntity',
  LocalAuthority = 'LocalAuthority',
  NewEntity = 'NewEntity',
  NewAuthority = 'NewAuthority'
}

@Component({
  selector: 'ds-external-source-entry-import-modal',
  styleUrls: ['./external-source-entry-import-modal.component.scss'],
  templateUrl: './external-source-entry-import-modal.component.html'
})
export class ExternalSourceEntryImportModalComponent implements OnInit {
  /**
   * The external source entry
   */
  externalSourceEntry: ExternalSourceEntry;

  /**
   * The current relationship-options used for filtering results
   */
  relationship: RelationshipOptions;

  /**
   * The metadata value for the entry's uri
   */
  uri: MetadataValue;

  /**
   * Local entities with a similar name
   */
  localEntitiesRD$: Observable<RemoteData<PaginatedList<SearchResult<Item>>>>;

  /**
   * Search options to use for fetching similar results
   */
  searchOptions: PaginatedSearchOptions;

  /**
   * The type of link to render in listable elements
   */
  linkTypes = CollectionElementLinkType;

  /**
   * The context we're currently in (submission)
   */
  context = Context.SubmissionModal;

  /**
   * List ID for selecting local entities
   */
  entityListId = 'external-source-import-entity';

  /**
   * List ID for selecting local authorities
   */
  authorityListId = 'external-source-import-authority';

  /**
   * ImportType enum
   */
  importType = ImportType;

  /**
   * The type of import the user currently has selected
   */
  selectedImportType = ImportType.None;

  constructor(public modal: NgbActiveModal,
              public lookupRelationService: LookupRelationService,
              private selectService: SelectableListService) {
  }

  ngOnInit(): void {
    this.uri = Metadata.first(this.externalSourceEntry.metadata, 'dc.identifier.uri');
    this.searchOptions = Object.assign(new PaginatedSearchOptions({ query: this.externalSourceEntry.value }));
    this.localEntitiesRD$ = this.lookupRelationService.getLocalResults(this.relationship, this.searchOptions);
  }

  /**
   * Close the window
   */
  close() {
    this.modal.close();
  }

  /**
   * Perform the import of the external entry
   */
  import() {
    console.log('TODO: Import');
  }

  /**
   * Deselected a local entity
   * @param event
   */
  deselectEntity(event) {
    this.selectedImportType = ImportType.None;
  }

  /**
   * Selected a local entity
   * @param event
   */
  selectEntity(event) {
    this.selectedImportType = ImportType.LocalEntity;
  }

  /**
   * Selected/deselected the new entity option
   */
  selectNewEntity() {
    if (this.selectedImportType === ImportType.NewEntity) {
      this.selectedImportType = ImportType.None;
    } else {
      this.selectedImportType = ImportType.NewEntity;
      this.deselectAllLists();
    }
  }

  /**
   * Selected/deselected the new authority option
   */
  selectNewAuthority() {
    if (this.selectedImportType === ImportType.NewAuthority) {
      this.selectedImportType = ImportType.None;
    } else {
      this.selectedImportType = ImportType.NewAuthority;
      this.deselectAllLists();
    }
  }

  /**
   * Deselect every element from both entity and authority lists
   */
  deselectAllLists() {
    this.selectService.deselectAll(this.entityListId);
    this.selectService.deselectAll(this.authorityListId);
  }
}

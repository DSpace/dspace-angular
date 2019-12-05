import { Component, EventEmitter, OnInit } from '@angular/core';
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
import { ListableObject } from '../../../../../../object-collection/shared/listable-object.model';
import { Collection } from '../../../../../../../core/shared/collection.model';
import { ItemDataService } from '../../../../../../../core/data/item-data.service';

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
   * The item in submission
   */
  item: Item;

  /**
   * The collection the user is submitting in
   */
  collection: Collection;

  /**
   * The ID of the collection to import entries to
   */
  collectionId: string;

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

  /**
   * The selected local entity
   */
  selectedEntity: ListableObject;

  /**
   * The selected local authority
   */
  selectedAuthority: ListableObject;

  /**
   * An object has been imported, send it to the parent component
   */
  importedObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  constructor(public modal: NgbActiveModal,
              public lookupRelationService: LookupRelationService,
              private selectService: SelectableListService,
              private itemService: ItemDataService) {
  }

  ngOnInit(): void {
    this.uri = Metadata.first(this.externalSourceEntry.metadata, 'dc.identifier.uri');
    this.searchOptions = Object.assign(new PaginatedSearchOptions({ query: 'sarah' }));
    this.localEntitiesRD$ = this.lookupRelationService.getLocalResults(this.relationship, this.searchOptions);
    this.collectionId = this.collection.id;
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
    switch (this.selectedImportType) {
      case ImportType.LocalEntity : {
        this.importLocalEntity();
        break;
      }
      case ImportType.NewEntity : {
        this.importNewEntity();
        break;
      }
      case ImportType.LocalAuthority : {
        this.importLocalAuthority();
        break;
      }
      case ImportType.NewAuthority : {
        this.importNewAuthority();
        break;
      }
    }
    this.selectedImportType = ImportType.None;
    this.deselectAllLists();
    this.close();
  }

  /**
   * Import the selected local entity
   */
  importLocalEntity() {
    if (this.selectedEntity !== undefined) {
      this.importedObject.emit(this.selectedEntity);
    }
  }

  /**
   * Create and import a new entity from the external entry
   */
  importNewEntity() {
    console.log(this.collection);
    this.itemService.importExternalSourceEntry(this.externalSourceEntry, this.collectionId).subscribe((response) => {
      console.log(response);
    });
  }

  /**
   * Import the selected local authority
   */
  importLocalAuthority() {
    // TODO: Implement ability to import local authorities
  }

  /**
   * Create and import a new authority from the external entry
   */
  importNewAuthority() {
    // TODO: Implement ability to import new authorities
  }

  /**
   * Deselected a local entity
   */
  deselectEntity() {
    this.selectedEntity = undefined;
    if (this.selectedImportType === ImportType.LocalEntity) {
      this.selectedImportType = ImportType.None;
    }
  }

  /**
   * Selected a local entity
   * @param entity
   */
  selectEntity(entity) {
    this.selectedEntity = entity;
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
   * Deselected a local authority
   */
  deselectAuthority() {
    this.selectedAuthority = undefined;
    if (this.selectedImportType === ImportType.LocalAuthority) {
      this.selectedImportType = ImportType.None;
    }
  }

  /**
   * Selected a local authority
   * @param authority
   */
  selectAuthority(authority) {
    this.selectedAuthority = authority;
    this.selectedImportType = ImportType.LocalAuthority;
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

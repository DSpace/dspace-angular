import { AsyncPipe } from '@angular/common';
import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { ExternalSourceDataService } from '../../../../../../core/data/external-source-data.service';
import { PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { PaginationService } from '../../../../../../core/pagination/pagination.service';
import { Collection } from '../../../../../../core/shared/collection.model';
import { Context } from '../../../../../../core/shared/context.model';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { ExternalSourceEntry } from '../../../../../../core/shared/external-source-entry.model';
import { Item } from '../../../../../../core/shared/item.model';
import { ItemType } from '../../../../../../core/shared/item-relationships/item-type.model';
import { getFirstCompletedRemoteData } from '../../../../../../core/shared/operators';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../my-dspace-page/my-dspace-configuration.service';
import {
  fadeIn,
  fadeInOut,
} from '../../../../../animations/fade';
import {
  hasValue,
  hasValueOperator,
} from '../../../../../empty.util';
import { ErrorComponent } from '../../../../../error/error.component';
import { ThemedLoadingComponent } from '../../../../../loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../object-collection/object-collection.component';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { PageSizeSelectorComponent } from '../../../../../page-size-selector/page-size-selector.component';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../../search/models/paginated-search-options.model';
import { ThemedSearchFormComponent } from '../../../../../search-form/themed-search-form.component';
import { VarDirective } from '../../../../../utils/var.directive';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { ExternalSourceEntryImportModalComponent } from './external-source-entry-import-modal/external-source-entry-import-modal.component';
import { ThemedExternalSourceEntryImportModalComponent } from './external-source-entry-import-modal/themed-external-source-entry-import-modal.component';

@Component({
  selector: 'ds-base-dynamic-lookup-relation-external-source-tab',
  styleUrls: ['./dynamic-lookup-relation-external-source-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-external-source-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    PageSizeSelectorComponent,
    ThemedLoadingComponent,
    ThemedSearchFormComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * Component rendering the tab content of an external source during submission lookup
 * Shows a list of entries matching the current search query with the option to import them into the repository
 */
export class DsDynamicLookupRelationExternalSourceTabComponent implements OnInit, OnDestroy {
  /**
   * The label to use for all messages (added to the end of relevant i18n keys)
   */
  @Input() label: string;

  /**
   * The ID of the list to add/remove selected items to/from
   */
  @Input() listId: string;

  /**
   * The item in submission
   */
  @Input() item: Item;

  /**
   * The collection the user is submitting an item into
   */
  @Input() collection: Collection;

  /**
   * The relationship-options for the current lookup
   */
  @Input() relationship: RelationshipOptions;

  /**
   * The context to displaying lists for
   */
  @Input() context: Context;

  /**
   * The search query
   */
  @Input() query: string;

  @Input() repeatable: boolean;
  /**
   * Emit an event when an object has been imported (or selected from similar local entries)
   */
  @Output() importedObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  /**
   * The initial pagination options
   */
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'spc',
    pageSize: 5,
  });

  /**
   * The current pagination options
   */
  currentPagination$: Observable<PaginationComponentOptions>;

  /**
   * The external source we're selecting entries for
   */
  @Input() externalSource: ExternalSource;

  /**
   * The displayed list of entries
   */
  entriesRD$: Observable<RemoteData<PaginatedList<ExternalSourceEntry>>>;

  /**
   * Config to use for the import buttons
   */
  importConfig;

  /**
   * The modal for importing the entry
   */
  modalRef: NgbModalRef;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  protected subs: Subscription[] = [];

  /**
   * The entity types compatible with the given external source
   */
  relatedEntityType: ItemType;

  constructor(
    protected router: Router,
    public searchConfigService: SearchConfigurationService,
    protected externalSourceService: ExternalSourceDataService,
    protected modalService: NgbModal,
    protected selectableListService: SelectableListService,
    protected paginationService: PaginationService,
  ) {
  }

  /**
   * Get the entries for the selected external source
   */
  ngOnInit(): void {
    this.externalSource.entityTypes.pipe(
      getFirstCompletedRemoteData(),
      map((entityTypesRD: RemoteData<PaginatedList<ItemType>>) => {
        return (entityTypesRD.hasSucceeded && entityTypesRD.payload.totalElements > 0) ? entityTypesRD.payload.page[0] : null;
      }),
    ).subscribe((entityType: ItemType) => {
      this.relatedEntityType = entityType;
    });

    this.resetRoute();
    this.entriesRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      switchMap((searchOptions: PaginatedSearchOptions) => {
        if (searchOptions.query === '') {
          searchOptions.query = this.query;
        }
        return this.externalSourceService.getExternalSourceEntries(this.externalSource.id, searchOptions).pipe(startWith(undefined));
      }),
    );
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.searchConfigService.paginationID, this.initialPagination);
    this.importConfig = {
      buttonLabel: 'submission.sections.describe.relationship-lookup.external-source.import-button-title.' + this.label,
    };
  }

  /**
   * Start the import of an entry by opening up an import modal window
   * @param entry The entry to import
   */
  import(entry) {
    this.modalRef = this.modalService.open(ThemedExternalSourceEntryImportModalComponent, {
      size: 'lg',
      container: 'ds-dynamic-lookup-relation-modal',
    });

    const modalComp$ = this.modalRef.componentInstance.compRef$.pipe(
      hasValueOperator(),
      map((compRef: ComponentRef<ExternalSourceEntryImportModalComponent>) => compRef.instance),
    );

    this.subs.push(modalComp$.subscribe((modalComp: ExternalSourceEntryImportModalComponent) => {
      modalComp.externalSourceEntry = entry;
      modalComp.item = this.item;
      // modalComp.collection = this.collection;
      modalComp.relationship = this.relationship;
      modalComp.label = this.label;
      modalComp.relatedEntityType = this.relatedEntityType;
    }));

    this.subs.push(modalComp$.pipe(
      switchMap((modalComp: ExternalSourceEntryImportModalComponent) => modalComp.importedObject),
    ).subscribe((object) => {
      this.selectableListService.selectSingle(this.listId, object);
      this.importedObject.emit(object);
    }));
  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Method to reset the route when the tab is opened to make sure no strange pagination issues appears
   */
  resetRoute() {
    this.paginationService.updateRoute(this.searchConfigService.paginationID, {
      page: 1,
      pageSize: 5,
    });
  }
}

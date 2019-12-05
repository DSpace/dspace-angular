import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { Router } from '@angular/router';
import { ExternalSourceService } from '../../../../../../core/data/external-source.service';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { ExternalSourceEntry } from '../../../../../../core/shared/external-source-entry.model';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { Context } from '../../../../../../core/shared/context.model';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { fadeIn, fadeInOut } from '../../../../../animations/fade';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceEntryImportModalComponent } from './external-source-entry-import-modal/external-source-entry-import-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { hasValue } from '../../../../../empty.util';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';

@Component({
  selector: 'ds-dynamic-lookup-relation-external-source-tab',
  styleUrls: ['./dynamic-lookup-relation-external-source-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-external-source-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
  animations: [
    fadeIn,
    fadeInOut
  ]
})

export class DsDynamicLookupRelationExternalSourceTabComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() listId: string;
  @Input() relationship: RelationshipOptions;
  @Input() repeatable: boolean;
  @Input() context: Context;
  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-external-source-relation-list',
    pageSize: 5
  });

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
  importConfig = {
    buttonLabel: 'submission.sections.describe.relationship-lookup.external-source.import-button-title'
  };

  /**
   * The modal for importing the entry
   */
  modalRef: NgbModalRef;

  /**
   * Subscription to the modal's importedObject event-emitter
   */
  importObjectSub: Subscription;

  constructor(private router: Router,
              public searchConfigService: SearchConfigurationService,
              private externalSourceService: ExternalSourceService,
              private modalService: NgbModal,
              private selectableListService: SelectableListService) {
  }

  ngOnInit(): void {
    this.entriesRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      switchMap((searchOptions: PaginatedSearchOptions) =>
        this.externalSourceService.getExternalSourceEntries(this.externalSource.id, searchOptions))
    )
  }

  /**
   * Start the import of an entry by opening up an import modal window
   * @param entry The entry to import
   */
  import(entry) {
    this.modalRef = this.modalService.open(ExternalSourceEntryImportModalComponent, {
      size: 'lg',
      container: 'ds-dynamic-lookup-relation-modal'
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = entry;
    modalComp.relationship = this.relationship;
    this.importObjectSub = modalComp.importedObject.subscribe((object) => {
      this.selectableListService.selectSingle(this.listId, object);
      this.selectObject.emit(object);
    });
  }

  ngOnDestroy(): void {
    if (hasValue(this.importObjectSub)) {
      this.importObjectSub.unsubscribe();
    }
  }
}

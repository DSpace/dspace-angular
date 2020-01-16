import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { Router } from '@angular/router';
import { ExternalSourceService } from '../../../../../../core/data/external-source.service';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { ExternalSourceEntry } from '../../../../../../core/shared/external-source-entry.model';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { startWith, switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { Context } from '../../../../../../core/shared/context.model';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { fadeIn, fadeInOut } from '../../../../../animations/fade';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';

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
/**
 * The tab displaying a list of importable entries for an external source
 */
export class DsDynamicLookupRelationExternalSourceTabComponent implements OnInit {
  /**
   * The label to use to display i18n messages (describing the type of relationship)
   */
  @Input() label: string;

  /**
   * The ID of the list to add/remove selected items to/from
   */
  @Input() listId: string;

  /**
   * Is the selection repeatable?
   */
  @Input() repeatable: boolean;

  /**
   * The context to display lists
   */
  @Input() context: Context;

  /**
   * Send an event to deselect an object from the list
   */
  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  /**
   * Send an event to select an object from the list
   */
  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  /**
   * The initial pagination to start with
   */
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

  constructor(private router: Router,
              public searchConfigService: SearchConfigurationService,
              private externalSourceService: ExternalSourceService) {
  }

  ngOnInit(): void {
    this.entriesRD$ = this.searchConfigService.paginatedSearchOptions.pipe(
      switchMap((searchOptions: PaginatedSearchOptions) =>
        this.externalSourceService.getExternalSourceEntries(this.externalSource.id, searchOptions).pipe(startWith(undefined)))
    )
  }
}

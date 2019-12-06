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

export class DsDynamicLookupRelationExternalSourceTabComponent implements OnInit {
  @Input() label: string;
  @Input() listId: string;
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

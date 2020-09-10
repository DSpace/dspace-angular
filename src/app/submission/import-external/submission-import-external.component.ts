import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { ExternalSourceService } from '../../core/data/external-source.service';
import { ExternalSourceData } from './import-external-searchbar/submission-import-external-searchbar.component';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { switchMap, filter, take } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { Context } from '../../core/shared/context.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RouteService } from '../../core/services/route.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionImportExternalPreviewComponent } from './import-external-preview/submission-import-external-preview.component';
import { fadeIn } from '../../shared/animations/fade';
import { PageInfo } from '../../core/shared/page-info.model';

/**
 * This component allows to submit a new workspaceitem importing the data from an external source.
 */
@Component({
  selector: 'ds-submission-import-external',
  styleUrls: ['./submission-import-external.component.scss'],
  templateUrl: './submission-import-external.component.html',
  animations: [ fadeIn ]
})
export class SubmissionImportExternalComponent implements OnInit {
  /**
   * The external source search data from the routing service.
   */
  public routeData: ExternalSourceData;
  /**
   * The displayed list of entries
   */
  public entriesRD$: BehaviorSubject<RemoteData<PaginatedList<ExternalSourceEntry>>>;
  /**
   * TRUE if the REST service is called to retrieve the external source items
   */
  public isLoading$: BehaviorSubject<boolean>;
  /**
   * Configuration to use for the import buttons
   */
  public importConfig: { buttonLabel: string };
  /**
   * Suffix for button label
   */
  public label: string;
  /**
   * The ID of the list to add/remove selected items to/from
   */
  public listId: string;
  /**
   * TRUE if the selection is repeatable
   */
  public repeatable: boolean;
  /**
   * The initial pagination options
   */
  public initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-external-source-relation-list',
    pageSize: 5
  });
  /**
   * The context to displaying lists for
   */
  public context: Context;
  /**
   * The modal for the entry preview
   */
  public modalRef: NgbModalRef;

  /**
   * Initialize the component variables.
   * @param {SearchConfigurationService} searchConfigService
   * @param {ExternalSourceService} externalService
   * @param {RouteService} routeService
   * @param {Router} router
   * @param {NgbModal} modalService
   */
  constructor(
    public searchConfigService: SearchConfigurationService,
    private externalService: ExternalSourceService,
    private routeService: RouteService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  /**
   * Get the entries for the selected external source and set initial configuration.
   */
  ngOnInit(): void {
    this.label      = 'Journal';
    this.listId     = 'list-submission-external-sources';
    this.context    = Context.EntitySearchModalWithNameVariants;
    this.repeatable = false;
    this.routeData  = { sourceId: '', query: '' };
    this.importConfig = {
      buttonLabel: 'submission.sections.describe.relationship-lookup.external-source.import-button-title.' + this.label
    };
    this.entriesRD$ = new BehaviorSubject(createSuccessfulRemoteDataObject(new PaginatedList(new PageInfo(), [])));
    this.isLoading$ = new BehaviorSubject(false);
    combineLatest(
      [
        this.routeService.getQueryParameterValue('source'),
        this.routeService.getQueryParameterValue('query')
      ]).pipe(
        filter(([source, query]) => source && query && source !== '' && query !== ''),
        filter(([source, query]) => source !== this.routeData.sourceId || query !== this.routeData.query),
        switchMap(([source, query]) => {
          this.routeData.sourceId = source;
          this.routeData.query = query;
          this.isLoading$.next(true);
          return this.searchConfigService.paginatedSearchOptions.pipe(
            switchMap((searchOptions: PaginatedSearchOptions) => {
              return this.externalService.getExternalSourceEntries(this.routeData.sourceId, searchOptions);
            }),
            take(1)
          )
        }),
    ).subscribe((rdData) => {
      this.entriesRD$.next(rdData);
      this.isLoading$.next(false);
    });
  }

  /**
   * Get the data from the searchbar and changes the router data.
   */
  public getExternalsourceData(event: ExternalSourceData): void {
    this.router.navigate(
      [],
      {
        queryParams: { source: event.sourceId, query: event.query },
        replaceUrl: true
      }
    );
  }

  /**
   * Display an item preview by opening up an import modal window.
   * @param entry The entry to import
   */
  public import(entry): void {
    this.modalRef = this.modalService.open(SubmissionImportExternalPreviewComponent, {
      size: 'lg',
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = entry;
  }
}

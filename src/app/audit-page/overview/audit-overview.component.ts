import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { AuditDataService } from '@dspace/core/data/audit-data.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  forkJoin,
  Observable,
  switchMap,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import { Audit } from '../../core/audit/model/audit.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { AuditTableComponent } from '../audit-table/audit-table.component';

/**
 * Component displaying a list of all audit in a paginated table
 */
@Component({
  selector: 'ds-audit-overview',
  templateUrl: './audit-overview.component.html',
  imports: [
    AsyncPipe,
    AuditTableComponent,
    TranslateModule,
  ],
})
export class AuditOverviewComponent implements OnInit {

  /**
   * List of all audits
   */
  auditsRD$: Observable<RemoteData<PaginatedList<Audit>>>;

  /**
   * The current pagination configuration for the page used by the FindAll method
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 10,
    sort: {
      field: 'timeStamp',
      direction: SortDirection.DESC,
    },
  });

  /**
   * The pagination id
   */
  pageId = 'aop';

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: this.pageId,
    pageSize: 10,
  });

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected auditService: AuditDataService,
              protected paginationService: PaginationService) {
  }

  ngOnInit(): void {
    this.setAudits();
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    this.auditsRD$ = this.paginationService.getFindListOptions(this.pageId, this.config).pipe(
      switchMap((config) => {
        return this.auditService.findAll(config, false, true, followLink('eperson'));
      }),
      filter(data => data && data?.payload?.page?.length > 0),
      map((audits) => {
        audits.payload?.page.forEach((audit) => {
          audit.hasDetails = this.auditService.auditHasDetails(audit);
        });

        return audits;
      }),
      mergeMap(auditsRD => {
        const updatedAudits$ = auditsRD.payload.page.map(audit => {
          return this.auditService.getEpersonName(audit).pipe(
            map(name => Object.assign(new Audit(), audit, { epersonName: name })),
          );
        });

        return forkJoin(updatedAudits$).pipe(
          map(updatedAudits => Object.assign(new RemoteData(
            auditsRD.timeCompleted,
            auditsRD.msToLive,
            auditsRD.lastUpdated,
            auditsRD.state,
            auditsRD.errorMessage,
            Object.assign(new PaginatedList(), { ...auditsRD.payload, page: updatedAudits }),
            auditsRD.statusCode,
          ))),
        );
      }),
    );
  }

}

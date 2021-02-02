import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { mergeMap } from 'rxjs/operators';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { Audit } from '../../core/audit/model/audit.model';
import { AuditDataService } from '../../core/audit/audit-data.service';
import { SortDirection } from '../../core/cache/models/sort-options.model';

/**
 * Component displaying a list of all audit in a paginated table
 */
@Component({
  selector: 'ds-audit-overview',
  templateUrl: './audit-overview.component.html',
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
      direction: SortDirection.DESC
    }
  });

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'audit-overview-pagination',
    pageSize: 10
  });

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected auditService: AuditDataService,
              protected authorizationService: AuthorizationDataService) {
  }

  ngOnInit(): void {
    this.setAudits();
  }

  /**
   * When the page is changed, make sure to update the list of audits to match the new page
   * @param event The page change event
   */
  onPageChange(event) {
    this.config = Object.assign(new FindListOptions(), this.config, {
      currentPage: event,
    });
    this.pageConfig.currentPage = event;
    this.setAudits();
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    this.auditsRD$ = this.isCurrentUserAdmin().pipe(
      mergeMap((isAdmin) => {
        if (isAdmin) {
          return this.auditService.findAll(this.config);
        }
      })
    );
  }

  isCurrentUserAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, undefined, undefined);
  }

  /**
   * Get the name of an EPerson by ID
   * @param audit  Audit object
   */
  getEpersonName(audit: Audit): Observable<string> {
    return this.auditService.getEpersonName(audit);
  }

}

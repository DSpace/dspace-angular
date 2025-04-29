import {
  AsyncPipe,
  DatePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuditDataService } from '../../core/audit/audit-data.service';
import { Audit } from '../../core/audit/model/audit.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component displaying a list of all audit in a paginated table
 */
@Component({
  selector: 'ds-audit-overview',
  templateUrl: './audit-overview.component.html',
  imports: [
    PaginationComponent,
    NgIf,
    AsyncPipe,
    TranslateModule,
    RouterLink,
    NgForOf,
    VarDirective,
    DatePipe,
  ],
  standalone: true,
})
export class AuditOverviewComponent implements OnInit {

  /**
   * List of all audits
   */
  auditsRD$: Observable<RemoteData<PaginatedList<Audit>>>;

  /**
   * Whether user is admin
   */
  isAdmin$: Observable<boolean>;

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
              protected authorizationService: AuthorizationDataService,
              protected paginationService: PaginationService) {
  }

  ngOnInit(): void {
    this.setAudits();
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    const config$ = this.paginationService.getFindListOptions(this.pageId, this.config);
    this.isAdmin$ = this.isCurrentUserAdmin();
    this.auditsRD$ = combineLatest([this.isAdmin$, config$]).pipe(
      mergeMap(([isAdmin, config]) => {
        if (isAdmin) {
          return this.auditService.findAll(config);
        }
      }),
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

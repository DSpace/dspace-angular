import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { Audit } from '../model/audit.model';
import { AuditDataService } from 'src/app/core/data/audit-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SortDirection } from 'src/app/core/cache/models/sort-options.model';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { getSucceededRemoteData, redirectToPageNotFoundOn404 } from 'src/app/core/shared/operators';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';



/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-overview',
  templateUrl: './object-audit-overview.component.html',
})
export class ObjectAuditOverviewComponent implements OnInit {

  /**
   * The object extracted from the route.
   */
  object;

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
    id: 'object-audit-overview-pagination',
    pageSize: 10
  });

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected itemService: ItemDataService,
              protected authorizationService: AuthorizationDataService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.itemService.findById(paramMap.get('objectId')).pipe(
        getSucceededRemoteData(),
        redirectToPageNotFoundOn404(this.router),
        take(1)
      ).subscribe(rd => {
        this.object = rd.payload;
        this.setAudits();
      })
      
    });
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
      flatMap((isAdmin) => {
        return this.auditService.findByObject(this.object.id, this.config);
      })
    )
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

  getSubject(audit: Audit): Observable<any> {
    return this.auditService.findById(audit.id, followLink('subject')).pipe(
      getSucceededRemoteData(),
      take(1),
      switchMap(rs => {
        return rs.payload.subject;
      }),
      getSucceededRemoteData(),
      take(1),
      map(rs => rs.payload )
      // tap(subject => { debugger; })
    );
  }


}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { Process } from '../processes/process.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { flatMap, map } from 'rxjs/operators';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { RoleService } from 'src/app/core/roles/role.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { of } from 'rxjs';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-process-overview',
  templateUrl: './process-overview.component.html',
})
/**
 * Component displaying a list of all processes in a paginated table
 */
export class ProcessOverviewComponent implements OnInit {

  /**
   * List of all processes
   */
  processesRD$: Observable<RemoteData<PaginatedList<Process>>>;

  /**
   * The current pagination configuration for the page used by the FindAll method
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'process-overview-pagination',
    pageSize: 20
  });

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected processService: ProcessDataService,
              protected ePersonService: EPersonDataService,
              protected authorizationService: AuthorizationDataService) {
  }

  ngOnInit(): void {
    this.setProcesses();
  }

  /**
   * When the page is changed, make sure to update the list of processes to match the new page
   * @param event The page change event
   */
  onPageChange(event) {
    this.config = Object.assign(new FindListOptions(), this.config, {
      currentPage: event,
    });
    this.pageConfig.currentPage = event;
    console.log('onPageChange', this.config);
    this.setProcesses();
  }

  /**
   * Send a request to fetch all processes for the current page
   */
  setProcesses() {
    this.processesRD$ = this.isCurrentUserAdmin().pipe(
      flatMap((isAdmin) => {
        if (isAdmin) {
          return this.processService.findAll(this.config);
        } else {
          return this.processService.searchBy('own', this.config);
        }
      })
    )
  }

  isCurrentUserAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, undefined, undefined);
  }

  /**
   * Get the name of an EPerson by ID
   * @param id  ID of the EPerson
   */
  getEpersonName(id: string): Observable<string> {
    return this.ePersonService.findById(id).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((eperson: EPerson) => eperson.name)
    );
  }

}

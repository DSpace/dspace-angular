import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Process } from '../processes/process.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { map, switchMap } from 'rxjs/operators';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';

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
    id: 'po',
    pageSize: 20
  });

  /**
   * Date format to use for start and end time of processes
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  constructor(protected processService: ProcessDataService,
              protected paginationService: PaginationService,
              protected ePersonService: EPersonDataService) {
  }

  ngOnInit(): void {
    this.setProcesses();
  }

  /**
   * Send a request to fetch all processes for the current page
   */
  setProcesses() {
    this.processesRD$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
      switchMap((config) => this.processService.findAll(config))
    );
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
  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.pageConfig.id);
  }

}

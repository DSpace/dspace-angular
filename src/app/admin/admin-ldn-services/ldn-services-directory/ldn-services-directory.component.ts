import { Component, OnDestroy, OnInit } from '@angular/core';
import { LdnDirectoryService } from '../ldn-services-services/ldn-directory.service';
import { Observable, Subscription } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { switchMap } from 'rxjs/operators';
import { LdnServicesService } from 'src/app/admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LdnServicesBulkDeleteService } from 'src/app/admin/admin-ldn-services/ldn-services-services/ldn-service-bulk-delete.service';
import { hasValue } from '../../../shared/empty.util';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ds-ldn-services-directory',
  templateUrl: './ldn-services-directory.component.html',
  styleUrls: ['./ldn-services-directory.component.scss'],
})
export class LdnServicesOverviewComponent implements OnInit, OnDestroy {

  ldnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>>;
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'po',
    pageSize: 20
  });
  private modalRef: any;
  isProcessingSub: Subscription;

  constructor(
      protected processLdnService: LdnServicesService,
      protected paginationService: PaginationService,
      protected modalService: NgbModal,
      public ldnServicesBulkDeleteService: LdnServicesBulkDeleteService,
      public ldnDirectoryService: LdnDirectoryService,
      private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.setLdnServices();
    this.ldnDirectoryService.listLdnServices();
    this.searchByLdnUrl();
  }

  setLdnServices() {
    debugger;
    this.ldnServicesRD$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
        switchMap((config) => this.processLdnService.findAll(config, true, false))
    );
    console.log()
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.pageConfig.id);
    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
  }

  openDeleteModal(content) {
    this.modalRef = this.modalService.open(content);
  }

  closeModal() {
    this.modalRef.close();
  }


  findByLdnUrl(): Observable<any> {
    const url = 'http://localhost:8080/server/api/ldn/ldnservices';

    return this.http.get(url);
  }

  searchByLdnUrl(): void {
    this.findByLdnUrl().subscribe(
        (response) => {
          console.log('Search results:', response);
        },
        (error) => {
          console.error('Error:', error);
        }
    );
  }

  deleteSelected() {
    this.ldnServicesBulkDeleteService.deleteSelectedLdnServices();

    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
    this.isProcessingSub = this.ldnServicesBulkDeleteService.isProcessing$()
        .subscribe((isProcessing) => {
          if (!isProcessing) {
            this.closeModal();
            this.setLdnServices();
          }
        });
  }
}

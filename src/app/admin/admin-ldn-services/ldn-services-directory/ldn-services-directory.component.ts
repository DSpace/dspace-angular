import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { hasValue } from '../../../shared/empty.util';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'ds-ldn-services-directory',
    templateUrl: './ldn-services-directory.component.html',
    styleUrls: ['./ldn-services-directory.component.scss'],
})
export class LdnServicesOverviewComponent implements OnInit, OnDestroy {

    selectedServiceId: number | null = null;
    servicesData: any[] = [];
    @ViewChild('deleteModal', {static: true}) deleteModal: TemplateRef<any>;
    ldnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>>;
    config: FindListOptions = Object.assign(new FindListOptions(), {
        elementsPerPage: 20
    });
    pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
        id: 'po',
        pageSize: 20
    });
    isProcessingSub: Subscription;
    private modalRef: any;

    constructor(
        protected processLdnService: LdnServicesService,
        protected paginationService: PaginationService,
        protected modalService: NgbModal,
        public ldnDirectoryService: LdnDirectoryService,
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {
        /*this.ldnDirectoryService.listLdnServices();*/
        this.findAllServices();
        this.setLdnServices();
        /*this.ldnServicesRD$.subscribe(data => {
            console.log('searchByLdnUrl()', data);
        });*/

        /*this.ldnServicesRD$.pipe(
            tap(data => {
                console.log('ldnServicesRD$ data:', data);
            })
        ).subscribe(() => {
            this.searchByLdnUrl();
        });*/

    }

    setLdnServices() {
        this.ldnServicesRD$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
            switchMap((config) => this.processLdnService.findAll(config, true, false))
        );
        console.log();
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


    findAllServices(): void {
        this.retrieveAll().subscribe(
            (response) => {
                this.servicesData = response._embedded.ldnservices;
                console.log('ServicesData =', this.servicesData);
            },
            (error) => {
                console.error('Error:', error);
            }
        );
    }

    retrieveAll(): Observable<any> {
        const url = 'http://localhost:8080/server/api/ldn/ldnservices';
        return this.http.get(url);
    }




    deleteSelected() {
        if (this.selectedServiceId !== null) {
            const deleteUrl = `http://localhost:8080/server/api/ldn/ldnservices/${this.selectedServiceId}`;
            this.http.delete(deleteUrl).subscribe(
                () => {
                    this.closeModal();
                    this.findAllServices();
                },
                (error) => {
                    console.error('Error deleting service:', error);
                }
            );
        }
    }

    selectServiceToDelete(serviceId: number) {
        this.selectedServiceId = serviceId;
        this.openDeleteModal(this.deleteModal);
    }

    toggleStatus(ldnService: any): void {
        const newStatus = !ldnService.status;

        const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${ldnService.id}`;
        const patchOperation = {
            op: 'replace',
            path: '/enabled',
            value: newStatus,
        };

        this.http.patch(apiUrl, [patchOperation]).subscribe(
            () => {
                console.log('Status updated successfully.');
                // After a successful update, fetch the data to refresh the view
                this.fetchServiceData(ldnService.id);
            },
            (error) => {
                console.error('Error updating status:', error);
            }
        );
    }

    fetchServiceData(serviceId: string): void {
        const apiUrl = `http://localhost:8080/server/api/ldn/ldnservices/${serviceId}`;

        this.http.get(apiUrl).subscribe(
            (data: any) => {
                console.log(data);
            },
            (error) => {
                console.error('Error fetching service data:', error);
            }
        );
    }
}

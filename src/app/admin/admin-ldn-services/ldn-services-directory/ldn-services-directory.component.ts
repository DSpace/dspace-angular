import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {RemoteData} from '../../../core/data/remote-data';
import {PaginatedList} from '../../../core/data/paginated-list.model';
import {FindListOptions} from '../../../core/data/find-list-options.model';
import {LdnService} from '../ldn-services-model/ldn-services.model';
import {PaginationComponentOptions} from '../../../shared/pagination/pagination-component-options.model';
import {map, switchMap} from 'rxjs/operators';
import {LdnServicesService} from 'src/app/admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import {PaginationService} from 'src/app/core/pagination/pagination.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {hasValue} from '../../../shared/empty.util';
import {Operation} from 'fast-json-patch';
import {getFirstCompletedRemoteData} from '../../../core/shared/operators';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'ds-ldn-services-directory',
  templateUrl: './ldn-services-directory.component.html',
  styleUrls: ['./ldn-services-directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LdnServicesOverviewComponent implements OnInit, OnDestroy {

  selectedServiceId: string | number | null = null;
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
    protected ldnServicesService: LdnServicesService,
    protected paginationService: PaginationService,
    protected modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.setLdnServices();
  }

  setLdnServices() {
    this.ldnServicesRD$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
      switchMap((config) => this.ldnServicesService.findAll(config, false, false).pipe(
        getFirstCompletedRemoteData()
      ))

    );
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
    this.cdRef.detectChanges();
  }

  selectServiceToDelete(serviceId: number) {
    this.selectedServiceId = serviceId;
    this.openDeleteModal(this.deleteModal);
  }

  deleteSelected(serviceId: string, ldnServicesService: LdnServicesService): void {
    if (this.selectedServiceId !== null) {
      ldnServicesService.delete(serviceId).pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<LdnService>) => {
        if (rd.hasSucceeded) {
          this.servicesData = this.servicesData.filter(service => service.id !== serviceId);
          this.ldnServicesRD$ = this.ldnServicesRD$.pipe(
            map((remoteData: RemoteData<PaginatedList<LdnService>>) => {
              if (remoteData.hasSucceeded) {
                remoteData.payload.page = remoteData.payload.page.filter(service => service.id.toString() !== serviceId);
              }
              return remoteData;
            })
          );
          this.cdRef.detectChanges();
          this.closeModal();
          this.notificationService.success(this.translateService.get('ldn-service-delete.notification.success.title'),
            this.translateService.get('ldn-service-delete.notification.success.content'));
        } else {
          this.notificationService.error(this.translateService.get('ldn-service-delete.notification.error.title'),
            this.translateService.get('ldn-service-delete.notification.error.content'));
          this.cdRef.detectChanges();
        }
      });
    }
  }


  toggleStatus(ldnService: any, ldnServicesService: LdnServicesService): void {
    const newStatus = !ldnService.enabled;
    const originalStatus = ldnService.enabled;

    const patchOperation: Operation = {
      op: 'replace',
      path: '/enabled',
      value: newStatus,
    };

    ldnServicesService.patch(ldnService, [patchOperation]).pipe(getFirstCompletedRemoteData()).subscribe(
      (rd: RemoteData<LdnService>) => {
        if (rd.hasSucceeded) {
          ldnService.enabled = newStatus;
          this.notificationService.success(this.translateService.get('ldn-enable-service.notification.success.title'),
            this.translateService.get('ldn-enable-service.notification.success.content'));
        } else {
          ldnService.enabled = originalStatus;
          this.notificationService.error(this.translateService.get('ldn-enable-service.notification.error.title'),
            this.translateService.get('ldn-enable-service.notification.error.content'));
        }
      }
    );
  }


}

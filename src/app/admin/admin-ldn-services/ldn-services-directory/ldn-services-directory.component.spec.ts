import {
  ChangeDetectorRef,
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { TruncatableComponent } from '../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { LdnService } from '../ldn-services-model/ldn-services.model';
import { LdnServicesOverviewComponent } from './ldn-services-directory.component';

describe('LdnServicesOverviewComponent', () => {
  let component: LdnServicesOverviewComponent;
  let fixture: ComponentFixture<LdnServicesOverviewComponent>;
  let ldnServicesService;
  let paginationService;
  let modalService: NgbModal;

  const translateServiceStub = {
    get: () => of('translated-text'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    paginationService = new PaginationServiceStub();
    ldnServicesService = jasmine.createSpyObj('ldnServicesService', {
      'findAll': createSuccessfulRemoteDataObject$({}),
      'delete': createSuccessfulRemoteDataObject$({}),
      'patch': createSuccessfulRemoteDataObject$({}),
    });
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), LdnServicesOverviewComponent],
      providers: [
        {
          provide: LdnServicesService,
          useValue: ldnServicesService,
        },
        { provide: PaginationService, useValue: paginationService },
        {
          provide: NgbModal, useValue: {
            open: () => {
              //
            },
          },
        },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(LdnServicesOverviewComponent, {
        remove: {
          imports: [
            PaginationComponent,
            TruncatableComponent,
            TruncatablePartComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdnServicesOverviewComponent);
    component = fixture.componentInstance;
    ldnServicesService = TestBed.inject(LdnServicesService);
    paginationService = TestBed.inject(PaginationService);
    modalService = TestBed.inject(NgbModal);
    component.modalRef = jasmine.createSpyObj({ close: null });
    component.isProcessingSub = jasmine.createSpyObj({ unsubscribe: null });
    component.ldnServicesRD$ = of({} as RemoteData<PaginatedList<LdnService>>);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setLdnServices', fakeAsync(() => {
      spyOn(component, 'setLdnServices').and.callThrough();
      component.ngOnInit();
      tick();
      expect(component.setLdnServices).toHaveBeenCalled();
    }));

    it('should set ldnServicesRD$ with mock data', fakeAsync(() => {
      spyOn(component, 'setLdnServices').and.callThrough();
      const testData: LdnService[] = Object.assign([new LdnService()], [
        { id: 1, name: 'Service 1', description: 'Description 1', enabled: true },
        { id: 2, name: 'Service 2', description: 'Description 2', enabled: false },
        { id: 3, name: 'Service 3', description: 'Description 3', enabled: true }]);

      const mockLdnServicesRD = createPaginatedList(testData);
      component.ldnServicesRD$ = createSuccessfulRemoteDataObject$(mockLdnServicesRD);
      fixture.detectChanges();

      component.ldnServicesRD$.subscribe((rd) => {
        expect(rd.payload.page).toEqual(mockLdnServicesRD.page);
      });
    }));
  });

  describe('ngOnDestroy', () => {
    it('should call paginationService.clearPagination and unsubscribe', () => {
      // spyOn(paginationService, 'clearPagination');
      // spyOn(component.isProcessingSub, 'unsubscribe');
      component.ngOnDestroy();
      expect(paginationService.clearPagination).toHaveBeenCalledWith(component.pageConfig.id);
      expect(component.isProcessingSub.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('openDeleteModal', () => {
    it('should open delete modal', () => {
      spyOn(modalService, 'open');
      component.openDeleteModal(component.deleteModal);
      expect(modalService.open).toHaveBeenCalledWith(component.deleteModal);
    });
  });

  describe('closeModal', () => {
    it('should close modal and detect changes', () => {
      // spyOn(component.modalRef, 'close');
      spyOn(component.cdRef, 'detectChanges');
      component.closeModal();
      expect(component.modalRef.close).toHaveBeenCalled();
      expect(component.cdRef.detectChanges).toHaveBeenCalled();
    });
  });

  describe('deleteSelected', () => {
    it('should delete selected service and update data', fakeAsync(() => {
      const serviceId = '123';
      const mockRemoteData = { /* just an empty object to retrieve as as RemoteData<PaginatedList<LdnService>>  */};
      spyOn(component, 'setLdnServices').and.callThrough();
      const deleteSpy = ldnServicesService.delete.and.returnValue(of(mockRemoteData as RemoteData<PaginatedList<LdnService>>));
      component.selectedServiceId = serviceId;
      component.deleteSelected(serviceId, ldnServicesService);
      tick();
      expect(deleteSpy).toHaveBeenCalledWith(serviceId);
    }));
  });

  describe('selectServiceToDelete', () => {
    it('should set service to delete', fakeAsync(() => {
      spyOn(component, 'openDeleteModal');
      const serviceId = 123;
      component.selectServiceToDelete(serviceId);
      expect(component.selectedServiceId).toEqual(serviceId);
      expect(component.openDeleteModal).toHaveBeenCalled();
    }));
  });

  describe('toggleStatus', () => {
    it('should toggle status', (() => {
      component.toggleStatus({ enabled: false }, ldnServicesService);
      expect(ldnServicesService.patch).toHaveBeenCalled();
    }));
  });

});

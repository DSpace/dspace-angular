import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ChangeDetectorRef, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { of } from 'rxjs';
import { LdnService } from "../ldn-services-model/ldn-services.model";
import { PaginatedList } from "../../../core/data/paginated-list.model";
import { RemoteData } from "../../../core/data/remote-data";
import { LdnServicesOverviewComponent } from './ldn-services-directory.component';

describe('LdnServicesOverviewComponent', () => {
  let component: LdnServicesOverviewComponent;
  let fixture: ComponentFixture<LdnServicesOverviewComponent>;
  let ldnServicesService: LdnServicesService;
  let paginationService: PaginationService;
  let modalService: NgbModal;
  let notificationsService: NotificationsService;
  let translateService: TranslateService;

  const translateServiceStub = {
    get: () => of('translated-text'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LdnServicesOverviewComponent],
      providers: [
        { provide: LdnServicesService, useValue: jasmine.createSpyObj('LdnServicesService', ['findAll', 'delete', 'patch']) },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: NgbModal, useValue: { open: () => { /*comment*/ } } },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: NotificationsService, useValue: NotificationsServiceStub },
        { provide: TranslateService, useValue: translateServiceStub },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdnServicesOverviewComponent);
    component = fixture.componentInstance;
    ldnServicesService = TestBed.inject(LdnServicesService);
    paginationService = TestBed.inject(PaginationService);
    modalService = TestBed.inject(NgbModal);
    notificationsService = TestBed.inject(NotificationsService);
    translateService = TestBed.inject(TranslateService);
    component.modalRef = jasmine.createSpyObj({ close: null });
    component.isProcessingSub = jasmine.createSpyObj({ unsubscribe: null });
    component.ldnServicesRD$ = of({} as RemoteData<PaginatedList<LdnService>>); // You can adjust the mock data as needed
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
      const mockData = { /* your mock data here */ };
      component.ldnServicesRD$ = of(mockData as RemoteData<PaginatedList<LdnService>>);
      component.ngOnInit();
      tick();
      expect(component.setLdnServices).toHaveBeenCalled();
      // Add more expectations based on your mock data and component behavior
    }));
  });

  describe('ngOnDestroy', () => {
    it('should call paginationService.clearPagination and unsubscribe', () => {
      spyOn(paginationService, 'clearPagination');
      spyOn(component.isProcessingSub, 'unsubscribe');
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
      spyOn(component.modalRef, 'close');
      spyOn(component.cdRef, 'detectChanges');
      component.closeModal();
      expect(component.modalRef.close).toHaveBeenCalled();
      expect(component.cdRef.detectChanges).toHaveBeenCalled();
    });
  });

  describe('deleteSelected', () => {
    it('should delete selected service and update data', fakeAsync(() => {
      const serviceId = '123';
      const mockRemoteData = { /* insert mock data with service id 123 */ };
      spyOn(component, 'setLdnServices').and.callThrough();
      const deleteSpy = spyOn(ldnServicesService, 'delete').and.returnValue(of(mockRemoteData as RemoteData<PaginatedList<LdnService>>));
      component.selectedServiceId = serviceId;
      component.deleteSelected(serviceId, ldnServicesService);
      tick();
      expect(deleteSpy).toHaveBeenCalledWith(serviceId);
      expect(mockRemoteData)
    }));
  });
});

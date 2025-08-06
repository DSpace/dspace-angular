import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AdminNotifyMessagesDataService } from '@dspace/core/coar-notify/notify-info/admin-notify-messages-data.service';
import { mockAdminNotifyMessages } from '@dspace/core/testing/admin-notify-messages.mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationService } from '../../../shared/search/search-configuration.service';
import { TruncatableComponent } from '../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { AdminNotifyDetailModalComponent } from '../admin-notify-detail-modal/admin-notify-detail-modal.component';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result.component';

describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifySearchResultComponent;
  let fixture: ComponentFixture<AdminNotifySearchResultComponent>;

  let adminNotifyMessageService: AdminNotifyMessagesDataService;
  let searchConfigService: SearchConfigurationService;
  let modalService: NgbModal;

  beforeEach(async () => {
    adminNotifyMessageService = jasmine.createSpyObj('adminNotifyMessageService', {
      getDetailedMessages: of(mockAdminNotifyMessages),
      reprocessMessage: of(mockAdminNotifyMessages),
    });
    searchConfigService = jasmine.createSpyObj('searchConfigService', {
      getCurrentConfiguration: of('NOTIFY.outgoing'),
    });

    await TestBed.configureTestingModule({
      imports: [
        AdminNotifyDetailModalComponent,
        AdminNotifySearchResultComponent,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AdminNotifyMessagesDataService, useValue: adminNotifyMessageService },
        DatePipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).overrideProvider(SEARCH_CONFIG_SERVICE, {
      useValue: searchConfigService,
    }).overrideComponent(AdminNotifySearchResultComponent, {
      remove: {
        imports: [
          TruncatableComponent,
          TruncatablePartComponent,
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotifySearchResultComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: of(true) }) }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isInbound).toBeFalsy();
  });

  it('should open modal', () => {
    component.openDetailModal(mockAdminNotifyMessages[0]);
    expect(modalService.open).toHaveBeenCalledWith(AdminNotifyDetailModalComponent);
  });

  it('should map messages', (done) => {
    component.messagesSubject$.subscribe((messages) => {
      expect(messages).toEqual(mockAdminNotifyMessages);
      done();
    });
  });

  it('should reprocess message', (done) => {
    component.reprocessMessage(mockAdminNotifyMessages[0]);
    component.messagesSubject$.subscribe((messages) => {
      expect(messages).toEqual(mockAdminNotifyMessages);
      done();
    });
  });

  it('should unsubscribe on destroy', () => {
    (component as any).subs = [of(null).subscribe()];

    spyOn((component as any).subs[0], 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).subs[0].unsubscribe).toHaveBeenCalled();
  });
});

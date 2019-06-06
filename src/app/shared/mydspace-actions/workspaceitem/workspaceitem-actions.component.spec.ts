import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MockTranslateLoader } from '../../mocks/mock-translate-loader';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service-stub';
import { RouterStub } from '../../testing/router-stub';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemActionsComponent } from './workspaceitem-actions.component';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';

let component: WorkspaceitemActionsComponent;
let fixture: ComponentFixture<WorkspaceitemActionsComponent>;

let mockObject: Workspaceitem;
let notificationsServiceStub: NotificationsServiceStub;

const mockDataService = jasmine.createSpyObj('WorkspaceitemDataService', {
  delete: jasmine.createSpy('delete')
});

const item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rd = new RemoteData(false, false, true, null, item);
mockObject = Object.assign(new Workspaceitem(), { item: observableOf(rd), id: '1234', uuid: '1234' });

describe('WorkspaceitemActionsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [WorkspaceitemActionsComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: WorkspaceitemDataService, useValue: mockDataService },
        NgbModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(WorkspaceitemActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceitemActionsComponent);
    component = fixture.componentInstance;
    component.object = mockObject;
    notificationsServiceStub = TestBed.get(NotificationsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should init object properly', () => {
    component.object = null;
    component.initObjects(mockObject);

    expect(component.object).toEqual(mockObject);
  });

  it('should display edit button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-primary'));

    expect(btn).toBeDefined();
  });

  it('should display delete button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-danger'));

    expect(btn).toBeDefined();
  });

  it('should call confirmDiscard on discard confirmation', fakeAsync(() => {
    mockDataService.delete.and.returnValue(observableOf(true));
    spyOn(component, 'reload');
    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    btn.nativeElement.click();
    fixture.detectChanges();

    const confirmBtn: any = ((document as any).querySelector('.modal-footer .btn-danger'));
    confirmBtn.click();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockDataService.delete).toHaveBeenCalledWith(mockObject);
    });

  }));

  it('should display a success notification on delete success', async(() => {
    spyOn((component as any).modalService, 'open').and.returnValue({result: Promise.resolve('ok')});
    mockDataService.delete.and.returnValue(observableOf(true));
    spyOn(component, 'reload');

    component.confirmDiscard('ok');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should display an error notification on delete failure', async(() => {
    spyOn((component as any).modalService, 'open').and.returnValue({result: Promise.resolve('ok')});
    mockDataService.delete.and.returnValue(observableOf(false));
    spyOn(component, 'reload');

    component.confirmDiscard('ok');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));
});

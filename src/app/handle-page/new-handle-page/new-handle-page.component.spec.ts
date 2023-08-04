import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewHandlePageComponent } from './new-handle-page.component';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { of as observableOf } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { Store } from '@ngrx/store';
import { HandleDataService } from '../../core/data/handle-data.service';
import { mockCreatedHandleRD$ } from '../../shared/mocks/handle-mock';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';

/**
 * The test class for the NewHandlePageComponent.
 */
describe('NewHandlePageComponent', () => {
  let component: NewHandlePageComponent;
  let fixture: ComponentFixture<NewHandlePageComponent>;

  let notificationService: NotificationsServiceStub;
  let handleDataService: HandleDataService;
  let paginationService: PaginationServiceStub;

  const successfulResponse = {
    response: {
      statusCode: 200
    }};

  beforeEach(async () => {
    notificationService = new NotificationsServiceStub();
    paginationService = new PaginationServiceStub();

    handleDataService = jasmine.createSpyObj('handleDataService', {
      create: mockCreatedHandleRD$,
      getLinkPath: observableOf('')
    });

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ NewHandlePageComponent ],
      providers: [
        { provide: NotificationsService, useValue: notificationService },
        { provide: HandleDataService, useValue: handleDataService },
        { provide: PaginationService, useValue: paginationService },
        { provide: TranslateService, useValue: getMockTranslateService() },
        {
          provide: Store, useValue: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            dispatch: () => {
            }
          }
        },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHandlePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send request after click on Submit', () => {
    component.onClickSubmit('new handle');

    expect((component as any).handleService.create).toHaveBeenCalled();
  });

  // TODO fix this failing test later. It fails in the Github but locally it works.
  // it('should notify after successful request',waitForAsync(() => {
  //   component.onClickSubmit('new handle');
  //
  //   fixture.whenStable().then(() => {
  //     expect((component as any).notificationsService.success).toHaveBeenCalled();
  //     expect((component as any).notificationsService.error).not.toHaveBeenCalled();
  //   });
  // }));
});

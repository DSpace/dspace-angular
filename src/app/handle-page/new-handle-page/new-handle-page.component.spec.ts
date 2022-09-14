import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewHandlePageComponent } from './new-handle-page.component';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { of as observableOf } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestService } from '../../core/data/request.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { Store } from '@ngrx/store';

/**
 * The test class for the NewHandlePageComponent.
 */
describe('NewHandlePageComponent', () => {
  let component: NewHandlePageComponent;
  let fixture: ComponentFixture<NewHandlePageComponent>;

  let notificationService: NotificationsServiceStub;
  let requestService = RequestService;

  const successfulResponse = {
    response: {
      statusCode: 200
    }};

  beforeEach(async () => {
    notificationService = new NotificationsServiceStub();
    requestService = jasmine.createSpyObj('requestService', {
      send: observableOf('response'),
      getByUUID: observableOf(successfulResponse),
      generateRequestId: observableOf('123456'),
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
        { provide: RequestService, useValue: requestService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: TranslateService, useValue: getMockTranslateService() },
        {
          provide: Store, useValue: {
            // tslint:disable-next-line:no-empty
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
    expect(component).toBeTruthy();
    component.onClickSubmit('new handle');

    expect((component as any).requestService.send).toHaveBeenCalled();
  });

  it('should notify after successful request', () => {
    component.onClickSubmit('new handle');

    expect((component as any).notificationsService.success).toHaveBeenCalled();
    expect((component as any).notificationsService.error).not.toHaveBeenCalled();
  });
});

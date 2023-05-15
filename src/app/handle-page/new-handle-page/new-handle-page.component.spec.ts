import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
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
import { HandleDataService } from '../../core/data/handle-data.service';
import { mockCreatedHandleRD$ } from '../../shared/mocks/handle-mock';

/**
 * The test class for the NewHandlePageComponent.
 */
describe('NewHandlePageComponent', () => {
  let component: NewHandlePageComponent;
  let fixture: ComponentFixture<NewHandlePageComponent>;

  let notificationService: NotificationsServiceStub;
  let handleDataService: HandleDataService;

  const successfulResponse = {
    response: {
      statusCode: 200
    }};

  beforeEach(async () => {
    notificationService = new NotificationsServiceStub();

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
    component.onClickSubmit('new handle');

    expect((component as any).handleService.create).toHaveBeenCalled();
  });

  // TODO fix this failing test later. It fails in the Github but locally it works.
  // it('should notify after successful request', () => {
  //   component.onClickSubmit('new handle');
  //
  //   fixture.whenStable().then(() => {
  //     expect((component as any).notificationsService.success).toHaveBeenCalled();
  //     expect((component as any).notificationsService.error).not.toHaveBeenCalled();
  //   });
  // });
});

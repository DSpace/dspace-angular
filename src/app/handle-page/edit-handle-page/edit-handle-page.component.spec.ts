import {ComponentFixture, TestBed } from '@angular/core/testing';
import { EditHandlePageComponent } from './edit-handle-page.component';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { PaginationService } from '../../core/pagination/pagination.service';
import { RequestService } from '../../core/data/request.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { RouterStub } from '../../shared/testing/router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { Handle } from '../../core/handle/handle.model';
import { PatchRequest } from '../../core/data/request.models';
import { Operation } from 'fast-json-patch';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RestResponse } from '../../core/cache/response.models';
import { RequestEntry } from 'src/app/core/data/request-entry.model';

/**
 * The test class for the EditHandlePageComponent which edit the Handle.
 */
describe('EditHandlePageComponent', () => {
  let component: EditHandlePageComponent;
  let fixture: ComponentFixture<EditHandlePageComponent>;

  let routeStub: any;
  let routerStub: RouterStub;
  let paginationServiceStub: PaginationServiceStub;
  let requestService: RequestService;
  let notificationServiceStub: NotificationsServiceStub;

  const paramHandle = 'handle';
  const paramHandleValue = '123456';

  const paramURL = 'url';
  const paramURLValue = 'some url';

  const paramID = 'id';
  const paramIDValue = '123';

  const paramSelflink = '_selflink';
  const paramSelflinkValue = 'http url link';

  const paramCurrentPage = 'currentPage';
  const paramCurrentPageValue = '1';

  const requestId = '123456';
  const newURL = 'new url';

  const handleObj = Object.assign(new Handle(), {
    handle: paramHandleValue,
    url: newURL,
    _links: {
      self: { href: paramSelflinkValue }
    }
  });
  const formValue = {
    handle: paramHandleValue,
    url: newURL,
    archive: false
  };

  const responseCacheEntry = new RequestEntry();
  responseCacheEntry.response = new RestResponse(true, 200, 'Success');

  beforeEach(async () => {
    const paramObject: Params = {};
    paramObject[paramHandle] = paramHandleValue;
    paramObject[paramURL] = paramURLValue;
    paramObject[paramID] = paramIDValue;
    paramObject[paramSelflink] = paramSelflinkValue;
    paramObject[paramCurrentPage] = paramCurrentPageValue;

    routeStub = {
      snapshot: {
        queryParams: paramObject,
        params: paramObject,
        queryParamMap: convertToParamMap(paramObject)
      }
    };
    routerStub = new RouterStub();
    paginationServiceStub = new PaginationServiceStub();
    notificationServiceStub = new NotificationsServiceStub();

    requestService = jasmine.createSpyObj('requestService', {
      send: observableOf('response'),
      getByHref: observableOf(responseCacheEntry),
      getByUUID: cold('a', { a: responseCacheEntry }),
      generateRequestId: requestId,
      removeByHrefSubstring: {}
    });

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ EditHandlePageComponent ],
      providers: [
        { provide: RequestService, useValue: requestService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: PaginationService, useValue: paginationServiceStub },
        { provide: NotificationsService, useValue: notificationServiceStub },
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
    fixture = TestBed.createComponent(EditHandlePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send request after click on Submit', () => {
    // request body should have the `archive` attribute which the Handle object doesn't have
    const handleRequestObj = {
      handle: handleObj.handle,
      url: handleObj.url,
      archive: formValue.archive,
      _links: handleObj._links
    };

    const patchOperation = {
      op: 'replace', path: '/updateHandle', value: handleRequestObj
    } as Operation;
    const patchRequest = new PatchRequest(requestId, paramSelflinkValue, [patchOperation]);

    // load values from url in the ngOnInit function
    (component as EditHandlePageComponent).ngOnInit();
    (component as EditHandlePageComponent).onClickSubmit(formValue);
    expect((component as any).requestService.send).toHaveBeenCalledWith(patchRequest);
  });

  it('should redirect to the handle table page', () => {
    // load values from url in the ngOnInit function
    (component as EditHandlePageComponent).ngOnInit();
    (component as EditHandlePageComponent).onClickSubmit(formValue);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect((component as any).paginationService.updateRouteWithUrl).toHaveBeenCalled();
    });
  });
});

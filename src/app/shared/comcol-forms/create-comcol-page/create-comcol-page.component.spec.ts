import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { RouteService } from '../../../core/services/route.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { Community } from '../../../core/shared/community.model';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { CreateComColPageComponent } from './create-comcol-page.component';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../../remote-data.utils';
import { ComColDataService } from '../../../core/data/comcol-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';

describe('CreateComColPageComponent', () => {
  let comp: CreateComColPageComponent<DSpaceObject>;
  let fixture: ComponentFixture<CreateComColPageComponent<DSpaceObject>>;
  let communityDataService: CommunityDataService;
  let dsoDataService: CommunityDataService;
  let routeService: RouteService;
  let router: Router;

  let community;
  let newCommunity;
  let communityDataServiceStub;
  let routeServiceStub;
  let routerStub;

  const logoEndpoint = 'rest/api/logo/endpoint';

  function initializeVars() {
    community = Object.assign(new Community(), {
      uuid: 'a20da287-e174-466a-9926-f66b9300d347',
      metadata: [{
        key: 'dc.title',
        value: 'test community'
      }]
    });

    newCommunity = Object.assign(new Community(), {
      uuid: '1ff59938-a69a-4e62-b9a4-718569c55d48',
      metadata: [{
        key: 'dc.title',
        value: 'new community'
      }]
    });

    communityDataServiceStub = {
      findById: (uuid) => createSuccessfulRemoteDataObject$(Object.assign(new Community(), {
        uuid: uuid,
        metadata: [{
          key: 'dc.title',
          value: community.name
        }]
      })),
      create: (com, uuid?) => createSuccessfulRemoteDataObject$(newCommunity),
      getLogoEndpoint: () => observableOf(logoEndpoint)
    };

    routeServiceStub = {
      getQueryParameterValue: (param) => observableOf(community.uuid)
    };
    routerStub = {
      navigate: (commands) => commands
    };

  }

  beforeEach(async(() => {
    initializeVars();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: ComColDataService, useValue: communityDataServiceStub },
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComColPageComponent);
    comp = fixture.componentInstance;
    (comp as any).type = Community.type;
    fixture.detectChanges();
    dsoDataService = (comp as any).dsoDataService;
    communityDataService = (comp as any).communityDataService;
    routeService = (comp as any).routeService;
    router = (comp as any).router;
  });

  describe('onSubmit', () => {
    let data;

    describe('with an empty queue in the uploader', () => {
      beforeEach(() => {
        data = {
          dso: Object.assign(new Community(), {
            metadata: [{
              key: 'dc.title',
              value: 'test'
            }]
          }),
          uploader: {
            options: {
              url: ''
            },
            queue: [],
            /* tslint:disable:no-empty */
            uploadAll: () => {}
            /* tslint:enable:no-empty */
          }
        };
      });

      it('should navigate when successful', () => {
        spyOn(router, 'navigate');
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalled();
      });

      it('should not navigate on failure', () => {
        spyOn(router, 'navigate');
        spyOn(dsoDataService, 'create').and.returnValue(createFailedRemoteDataObject$(newCommunity));
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    describe('with at least one item in the uploader\'s queue', () => {
      beforeEach(() => {
        data = {
          dso: Object.assign(new Community(), {
            metadata: [{
              key: 'dc.title',
              value: 'test'
            }]
          }),
          uploader: {
            options: {
              url: ''
            },
            queue: [
              {}
            ],
            /* tslint:disable:no-empty */
            uploadAll: () => {}
            /* tslint:enable:no-empty */
          }
        };
      });

      it('should not navigate', () => {
        spyOn(router, 'navigate');
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should set the uploader\'s url to the logo\'s endpoint', () => {
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(data.uploader.options.url).toEqual(logoEndpoint);
      });

      it('should call the uploader\'s uploadAll', () => {
        spyOn(data.uploader, 'uploadAll');
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(data.uploader.uploadAll).toHaveBeenCalled();
      });
    });
  });
});

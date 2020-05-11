import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { ComColDataService } from '../../../../core/data/comcol-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Community } from '../../../../core/shared/community.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NotificationsService } from '../../../notifications/notifications.service';
import { SharedModule } from '../../../shared.module';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { ComcolMetadataComponent } from './comcol-metadata.component';

describe('ComColMetadataComponent', () => {
  let comp: ComcolMetadataComponent<DSpaceObject>;
  let fixture: ComponentFixture<ComcolMetadataComponent<DSpaceObject>>;
  let dsoDataService: CommunityDataService;
  let router: Router;

  let community;
  let newCommunity;
  let communityDataServiceStub;
  let routerStub;
  let routeStub;

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
      update: (com, uuid?) => createSuccessfulRemoteDataObject$(newCommunity),
      getLogoEndpoint: () => observableOf(logoEndpoint)
    };

    routerStub = {
      navigate: (commands) => commands
    };

    routeStub = {
      parent: {
        data: observableOf({
          dso: new RemoteData(false, false, true, null, community)
        })
      }
    };

  }

  beforeEach(async(() => {
    initializeVars();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: ComColDataService, useValue: communityDataServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComcolMetadataComponent);
    comp = fixture.componentInstance;
    (comp as any).type = Community.type;
    fixture.detectChanges();
    dsoDataService = (comp as any).dsoDataService;
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
        }
      });

      it('should navigate when successful', () => {
        spyOn(router, 'navigate');
        comp.onSubmit(data);
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalled();
      });

      it('should not navigate on failure', () => {
        spyOn(router, 'navigate');
        spyOn(dsoDataService, 'update').and.returnValue(createFailedRemoteDataObject$(newCommunity));
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
        }
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

  describe('navigateToHomePage', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
      comp.navigateToHomePage();
    });

    it('should navigate', () => {
      expect(router.navigate).toHaveBeenCalled();
    });
  });

});

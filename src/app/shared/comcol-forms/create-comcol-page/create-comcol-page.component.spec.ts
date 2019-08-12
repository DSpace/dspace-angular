import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { RouteService } from '../../services/route.service';
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
import { DataService } from '../../../core/data/data.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../../testing/utils';

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
      create: (com, uuid?) => createSuccessfulRemoteDataObject$(newCommunity)

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
        { provide: DataService, useValue: communityDataServiceStub },
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComColPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    dsoDataService = (comp as any).dsoDataService;
    communityDataService = (comp as any).communityDataService;
    routeService = (comp as any).routeService;
    router = (comp as any).router;
  });

  describe('onSubmit', () => {
    let data;
    beforeEach(() => {
      data = Object.assign(new Community(), {
        metadata: [{
          key: 'dc.title',
          value: 'test'
        }]
      });
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
});

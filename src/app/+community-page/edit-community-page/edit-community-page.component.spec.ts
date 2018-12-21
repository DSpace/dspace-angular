import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';

fdescribe('EditCommunityPageComponent', () => {
  let comp: EditCommunityPageComponent;
  let fixture: ComponentFixture<EditCommunityPageComponent>;
  let communityDataService: CommunityDataService;
  let routeService: RouteService;
  let router: Router;

  let community;
  let newCommunity;
  let communityDataServiceStub;
  let routeServiceStub;
  let routerStub;
  let routeStub;

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
      findById: (uuid) => observableOf(new RemoteData(false, false, true, null, Object.assign(new Community(), {
        uuid: uuid,
        metadata: [{
          key: 'dc.title',
          value: community.name
        }]
      }))),
      update: (com, uuid?) => observableOf(new RemoteData(false, false, true, undefined, newCommunity))

    };

    routeServiceStub = {
      getQueryParameterValue: (param) => observableOf(community.uuid)
    };
    routerStub = {
      navigate: (commands) => commands
    };

    routeStub = {
      data: observableOf(community)
    };

  }

  beforeEach(async(() => {
    initializeVars();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [EditCommunityPageComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
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
      spyOn(communityDataService, 'update').and.returnValue(observableOf(new RemoteData(true, true, false, undefined, newCommunity)));
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

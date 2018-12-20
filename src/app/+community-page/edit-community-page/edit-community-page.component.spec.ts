import { CreateCommunityPageComponent } from './create-community-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { DSOSuccessResponse, ErrorResponse } from '../../core/cache/response-cache.models';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { CommunityFormComponent } from '../community-form/community-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestError } from '../../core/data/request.models';

describe('CreateCommunityPageComponent', () => {
  let comp: CreateCommunityPageComponent;
  let fixture: ComponentFixture<CreateCommunityPageComponent>;
  let communityDataService: CommunityDataService;
  let routeService: RouteService;
  let router: Router;

  const community = Object.assign(new Community(), {
    uuid: 'a20da287-e174-466a-9926-f66b9300d347',
    name: 'test community'
  });

  const newCommunity = Object.assign(new Community(), {
    uuid: '1ff59938-a69a-4e62-b9a4-718569c55d48',
    name: 'new community'
  });

  const communityDataServiceStub = {
    findById: (uuid) => Observable.of(new RemoteData(false, false, true, null, Object.assign(new Community(), {
      uuid: uuid,
      name: community.name
    }))),
    create: (com, uuid?) => Observable.of(new RemoteData(false, false, true, undefined, newCommunity))
  };
  const routeServiceStub = {
    getQueryParameterValue: (param) => Observable.of(community.uuid)
  };
  const routerStub = {
    navigate: (commands) => commands
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CreateCommunityPageComponent, CommunityFormComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    communityDataService = (comp as any).communityDataService;
    routeService = (comp as any).routeService;
    router = (comp as any).router;
  });

  describe('onSubmit', () => {
    const data = {
      name: 'test'
    };

    it('should navigate when successful', () => {
      spyOn(router, 'navigate');
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not navigate on failure', () => {
      spyOn(router, 'navigate');
      spyOn(communityDataService, 'create').and.returnValue(Observable.of(new RemoteData(true, true, false, undefined, newCommunity)));
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

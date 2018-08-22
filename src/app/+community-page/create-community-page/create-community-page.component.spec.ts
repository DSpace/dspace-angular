import { CreateCommunityPageComponent } from './create-community-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { DSOSuccessResponse } from '../../core/cache/response-cache.models';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { CommunityFormComponent } from '../community-form/community-form.component';

describe('CreateCommunityPageComponent', () => {
  let comp: CreateCommunityPageComponent;
  let fixture: ComponentFixture<CreateCommunityPageComponent>;
  let communityDataService: CommunityDataService;
  let routeService: RouteService;
  let router: any = {};

  const community = Object.assign(new Community(), {
    uuid: 'a20da287-e174-466a-9926-f66b9300d347',
    name: 'test community'
  });

  const communityDataServiceStub = {
    findById: (uuid) => Observable.of(new RemoteData(false, false, true, null, Object.assign(new Community(), {
      uuid: uuid,
      name: community.name
    }))),
    create: (com, uuid?) => Observable.of({
      response: new DSOSuccessResponse(null,'200',null)
    })
  };
  const routeServiceStub = {
    getQueryParameterValue: (param) => Observable.of(community.uuid)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule],
      declarations: [CreateCommunityPageComponent, CommunityFormComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: router }
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

  it('should navigate on successful submit', () => {
    spyOn(router, 'navigateByUrl');
    comp.onSubmit({
      name: 'test'
    });
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});

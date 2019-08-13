import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { Community } from '../../../core/shared/community.model';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { EditComColPageComponent } from './edit-comcol-page.component';
import { DataService } from '../../../core/data/data.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../../testing/utils';

describe('EditComColPageComponent', () => {
  let comp: EditComColPageComponent<DSpaceObject>;
  let fixture: ComponentFixture<EditComColPageComponent<DSpaceObject>>;
  let dsoDataService: CommunityDataService;
  let router: Router;

  let community;
  let newCommunity;
  let communityDataServiceStub;
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
      update: (com, uuid?) => createSuccessfulRemoteDataObject$(newCommunity)

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
      providers: [
        { provide: DataService, useValue: communityDataServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComColPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    dsoDataService = (comp as any).dsoDataService;
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
      spyOn(dsoDataService, 'update').and.returnValue(createFailedRemoteDataObject$(newCommunity));
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

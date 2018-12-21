import { SharedModule } from '../../shared/shared.module';
import { Community } from '../../core/shared/community.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { RemoteData } from '../../core/data/remote-data';
import { CreateCollectionPageComponent } from './create-collection-page.component';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { of as observableOf } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateCollectionPageComponent', () => {
  let comp: CreateCollectionPageComponent;
  let fixture: ComponentFixture<CreateCollectionPageComponent>;
  let collectionDataService: CollectionDataService;
  let communityDataService: CommunityDataService;
  let routeService: RouteService;
  let router: Router;

  const community = Object.assign(new Community(), {
    uuid: 'a20da287-e174-466a-9926-f66b9300d347',
    metadata: [{
      key: 'dc.title',
      value: 'test collection'
    }]
  });

  const collection = Object.assign(new Collection(), {
    uuid: 'ce41d451-97ed-4a9c-94a1-7de34f16a9f4',
    metadata: [{
      key: 'dc.title',
      value: 'new collection'
    }]  });

  const collectionDataServiceStub = {
    create: (col, uuid?) => observableOf(new RemoteData(false, false, true, undefined, collection))
  };
  const communityDataServiceStub = {
    findById: (uuid) => observableOf(new RemoteData(false, false, true, null, Object.assign(new Community(), {
      uuid: uuid,
      metadata: [{
        key: 'dc.title',
        value: community.name
      }]
    })))
  };
  const routeServiceStub = {
    getQueryParameterValue: (param) => observableOf(community.uuid)
  };
  const routerStub = {
    navigate: (commands) => commands
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CreateCollectionPageComponent],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    collectionDataService = (comp as any).collectionDataService;
    communityDataService = (comp as any).communityDataService;
    routeService = (comp as any).routeService;
    router = (comp as any).router;
  });

  describe('onSubmit', () => {
    const data = {
      metadata: [{
        key: 'dc.title',
        value:'test'
      }]
    };

    it('should navigate when successful', () => {
      spyOn(router, 'navigate');
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not navigate on failure', () => {
      spyOn(router, 'navigate');
      spyOn(collectionDataService, 'create').and.returnValue(observableOf(new RemoteData(true, true, false, undefined, collection)));
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

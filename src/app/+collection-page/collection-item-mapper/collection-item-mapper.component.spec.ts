import { CollectionItemMapperComponent } from './collection-item-mapper.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { SearchPageModule } from '../../+search-page/search-page.module';
import { ObjectCollectionComponent } from '../../shared/object-collection/object-collection.component';
import { ItemSelectComponent } from '../../shared/item-select/item-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { RouterStub } from '../../shared/testing/router-stub';
import { SearchConfigurationService } from '../../+search-page/search-service/search-configuration.service';
import { SearchService } from '../../+search-page/search-service/search.service';
import { SearchServiceStub } from '../../shared/testing/search-service-stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { ItemDataService } from '../../core/data/item-data.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Collection } from '../../core/shared/collection.model';

fdescribe('CollectionItemMapperComponent', () => {
  let comp: CollectionItemMapperComponent;
  let fixture: ComponentFixture<CollectionItemMapperComponent>;

  let route: ActivatedRoute;
  let router: Router;
  let searchConfigService: SearchConfigurationService;
  let searchService: SearchService;
  let notificationsService: NotificationsService;
  let itemDataService: ItemDataService;

  const searchConfigServiceStub = {

  };
  const itemDataServiceStub = {

  };
  const mockCollection: Collection = Object.assign(new Collection(), {
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Test title'
      }]
  });
  const activatedRouteStub = new ActivatedRouteStub({}, { collection: mockCollection });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SharedModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [CollectionItemMapperComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: TranslateService, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionItemMapperComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    route = (comp as any).route;
    router = (comp as any).router;
    searchConfigService = (comp as any).searchConfigService;
    searchService = (comp as any).searchService;
    notificationsService = (comp as any).notificationsService;
    itemDataService = (comp as any).itemDataService;
  });

  it('should test', () => {

  });

});

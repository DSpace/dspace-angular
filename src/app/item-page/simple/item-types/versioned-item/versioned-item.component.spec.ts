import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionedItemComponent } from './versioned-item.component';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { ItemVersionsSharedService } from '../../../../shared/item/item-versions/item-versions-shared.service';
import { Item } from '../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { createRelationshipsObservable, mockRouteService } from '../shared/item.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Version } from '../../../../core/shared/version.model';
import { RouteService } from '../../../../core/services/route.service';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: new MetadataMap(),
  relationships: createRelationshipsObservable(),
  _links: {
    self: {
      href: 'item-href'
    },
    version: {
      href: 'version-href'
    }
  }
});


@Component({template: ''})
class DummyComponent {
}

describe('VersionedItemComponent', () => {
  let component: VersionedItemComponent;
  let fixture: ComponentFixture<VersionedItemComponent>;

  let versionService: VersionDataService;
  let versionHistoryService: VersionHistoryDataService;

  const versionServiceSpy = jasmine.createSpyObj('versionService', {
    findByHref: createSuccessfulRemoteDataObject$<Version>(new Version()),
  });

  const versionHistoryServiceSpy = jasmine.createSpyObj('versionHistoryService', {
    createVersion: createSuccessfulRemoteDataObject$<Version>(new Version()),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionedItemComponent, DummyComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          }
        }),
      ],
      providers: [
        { provide: VersionHistoryDataService, useValue: versionHistoryServiceSpy },
        { provide: VersionDataService, useValue: versionServiceSpy },
        { provide: NotificationsService, useValue: {} },
        { provide: ItemVersionsSharedService, useValue: {} },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: SearchService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: RouteService, useValue: mockRouteService }
      ]
    }).compileComponents();
    versionService = TestBed.inject(VersionDataService);
    versionHistoryService = TestBed.inject(VersionHistoryDataService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionedItemComponent);
    component = fixture.componentInstance;
    component.object = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when onCreateNewVersion() is called', () => {
    it('should call versionService.findByHref', () => {
      component.onCreateNewVersion();
      expect(versionService.findByHref).toHaveBeenCalledWith('version-href');
    });
  });

});

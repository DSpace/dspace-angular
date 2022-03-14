import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemVersionContainerComponent } from './item-version-container.component';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { SharedModule } from '../../../shared.module';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { Version } from '../../../../core/shared/version.model';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ItemVersionsSharedService } from '../../../item/item-versions/item-versions-shared.service';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { RouteService } from '../../../../core/services/route.service';
import { mockRouteService } from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('ItemVersionContainerComponent', () => {
  let component: ItemVersionContainerComponent;
  let fixture: ComponentFixture<ItemVersionContainerComponent>;
  let dso: DSpaceObject;

  const versionServiceSpy = jasmine.createSpyObj('versionService', {
    findByHref: createSuccessfulRemoteDataObject$<Version>(new Version()),
  });

  const versionHistoryServiceSpy = jasmine.createSpyObj('versionHistoryService', {
    createVersion: createSuccessfulRemoteDataObject$<Version>(new Version()),
  });


  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    TestBed.configureTestingModule({
      declarations: [ItemVersionContainerComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: VersionHistoryDataService, useValue: versionHistoryServiceSpy },
        { provide: TranslateService, useValue: {} },
        { provide: VersionDataService, useValue: versionServiceSpy },
        { provide: NotificationsService, useValue: {} },
        { provide: ItemVersionsSharedService, useValue: {} },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: SearchService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: RouteService, useValue: mockRouteService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionContainerComponent);
    component = fixture.componentInstance;
    component.object = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

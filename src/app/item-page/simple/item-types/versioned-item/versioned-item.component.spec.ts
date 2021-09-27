import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionedItemComponent } from './versioned-item.component';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { TranslateService } from '@ngx-translate/core';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { ItemVersionsSharedService } from '../../../../shared/item/item-versions/item-versions-shared.service';
import { Item } from '../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { createRelationshipsObservable } from '../shared/item.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: new MetadataMap(),
  relationships: createRelationshipsObservable()
});

describe('VersionedItemComponent', () => {
  let component: VersionedItemComponent;
  let fixture: ComponentFixture<VersionedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionedItemComponent ],
      providers: [
        { provide: VersionHistoryDataService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: VersionDataService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: ItemVersionsSharedService, useValue: {} },
      ]
    })
    .compileComponents();
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
});

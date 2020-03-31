import { ItemVersionsNoticeComponent } from './item-versions-notice.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VersionHistory } from '../../../../core/shared/version-history.model';
import { Version } from '../../../../core/shared/version.model';
import { Item } from '../../../../core/shared/item.model';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';

describe('ItemVersionsNoticeComponent', () => {
  let component: ItemVersionsNoticeComponent;
  let fixture: ComponentFixture<ItemVersionsNoticeComponent>;

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1'
  });
  const firstVersion = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: new Date(2020, 1, 1),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory)
  });
  const latestVersion = Object.assign(new Version(), {
    id: '2',
    version: 2,
    summary: 'latest version',
    created: new Date(2020, 1, 2),
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory)
  });
  const versions = [latestVersion, firstVersion];
  versionHistory.versions = createSuccessfulRemoteDataObject$(createPaginatedList(versions));
  const firstItem = Object.assign(new Item(), {
    id: 'first_item_id',
    uuid: 'first_item_id',
    handle: '123456789/1',
    version: createSuccessfulRemoteDataObject$(firstVersion)
  });
  const latestItem = Object.assign(new Item(), {
    id: 'latest_item_id',
    uuid: 'latest_item_id',
    handle: '123456789/2',
    version: createSuccessfulRemoteDataObject$(latestVersion)
  });
  firstVersion.item = createSuccessfulRemoteDataObject$(firstItem);
  latestVersion.item = createSuccessfulRemoteDataObject$(latestItem);
  const versionHistoryService = jasmine.createSpyObj('versionHistoryService', {
    getVersions: createSuccessfulRemoteDataObject$(createPaginatedList(versions))
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemVersionsNoticeComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: VersionHistoryDataService, useValue: versionHistoryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('when the item is the latest version', () => {
    beforeEach(() => {
      initComponentWithItem(latestItem);
    });

    it('should not display a notice', () => {
      const alert = fixture.debugElement.query(By.css('ds-alert'));
      expect(alert).toBeNull();
    });
  });

  describe('when the item is not the latest version', () => {
    beforeEach(() => {
      initComponentWithItem(firstItem);
    });

    it('should display a notice', () => {
      const alert = fixture.debugElement.query(By.css('ds-alert'));
      expect(alert).not.toBeNull();
    });
  });

  function initComponentWithItem(item: Item) {
    fixture = TestBed.createComponent(ItemVersionsNoticeComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  }
});

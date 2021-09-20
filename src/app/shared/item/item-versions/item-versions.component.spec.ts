import { ItemVersionsComponent } from './item-versions.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../../utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { VersionHistory } from '../../../core/shared/version-history.model';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { of as observableOf } from 'rxjs';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../testing/pagination-service.stub';
import { AuthService } from '../../../core/auth/auth.service';
import { VersionDataService } from '../../../core/data/version-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

describe('ItemVersionsComponent', () => {
  let component: ItemVersionsComponent;
  let fixture: ComponentFixture<ItemVersionsComponent>;
  let authenticationService: AuthService;
  let authorizationService: AuthorizationDataService;

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1'
  });

  const version1 = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: new Date(2020, 1, 1),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory)
  });
  const version2 = Object.assign(new Version(), {
    id: '2',
    version: 2,
    summary: 'second version',
    created: new Date(2020, 1, 2),
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory)
  });

  const versions = [version1, version2];
  versionHistory.versions = createSuccessfulRemoteDataObject$(createPaginatedList(versions));

  const item1 = Object.assign(new Item(), {
    uuid: 'item-identifier-1',
    handle: '123456789/1',
    version: createSuccessfulRemoteDataObject$(version1),
    _links: {
      self: {
        href: '/items/item-identifier-1'
      }
    }
  });
  const item2 = Object.assign(new Item(), {
    uuid: 'item-identifier-2',
    handle: '123456789/2',
    version: createSuccessfulRemoteDataObject$(version2),
    _links: {
      self: {
        href: '/items/item-identifier-2'
      }
    }
  });
  const items = [item1, item2];
  version1.item = createSuccessfulRemoteDataObject$(item1);
  version2.item = createSuccessfulRemoteDataObject$(item2);

  const versionHistoryService = jasmine.createSpyObj('versionHistoryService', {
    getVersions: createSuccessfulRemoteDataObject$(createPaginatedList(versions))
  });

  beforeEach(waitForAsync(() => {
    authenticationService = jasmine.createSpyObj('authenticationService', {
        isAuthenticated: observableOf(true),
        setRedirectUrl: {}
      }
    );
    authorizationService = jasmine.createSpyObj('authorizationService', {
        isAuthorized: observableOf(true),
      }
    );

    TestBed.configureTestingModule({
      declarations: [ItemVersionsComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: AuthService, useValue: authenticationService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: VersionHistoryDataService, useValue: versionHistoryService },
        { provide: ItemDataService, useValue: {} },
        { provide: VersionDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsComponent);
    component = fixture.componentInstance;
    component.item = item1;
    fixture.detectChanges();
  });

  it(`should display ${versions.length} rows`, () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(versions.length);
  });

  versions.forEach((version: Version, index: number) => {
    const versionItem = items[index];

    it(`should display version ${version.version} in the correct column for version ${version.id}`, () => {
      const id = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-version`));
      expect(id.nativeElement.textContent).toContain(version.version.toString());
    });

    // Check if the current version contains an asterisk
    if (item1.uuid === versionItem.uuid) {
      it('should add an asterisk to the version of the selected item', () => {
        const item = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-version`));
        expect(item.nativeElement.textContent).toContain('*');
      });
    }

    it(`should display date ${version.created} in the correct column for version ${version.id}`, () => {
      const date = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-date`));
      switch (versionItem.uuid) {
        case item1.uuid:
          expect(date.nativeElement.textContent.trim()).toEqual('2020-02-01 00:00:00');
          break;
        case item2.uuid:
          expect(date.nativeElement.textContent.trim()).toEqual('2020-02-02 00:00:00');
          break;
        default:
          throw new Error('Unexpected versionItem');
      }
    });

    it(`should display summary ${version.summary} in the correct column for version ${version.id}`, () => {
      const summary = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-summary`));
      expect(summary.nativeElement.textContent).toEqual(version.summary);
    });
  });
});

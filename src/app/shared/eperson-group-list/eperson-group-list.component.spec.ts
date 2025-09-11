import {
  ChangeDetectorRef,
  Component,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { hot } from 'jasmine-marbles';
import uniqueId from 'lodash/uniqueId';
import { of } from 'rxjs';

import {
  APP_DATA_SERVICES_MAP,
  LazyDataServicesMap,
} from '../../../config/app-config.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { RequestService } from '../../core/data/request.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { EPERSON } from '../../core/eperson/models/eperson.resource-type';
import { GROUP } from '../../core/eperson/models/group.resource-type';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { DSONameServiceMock } from '../mocks/dso-name.service.mock';
import { getMockRequestService } from '../mocks/request.service.mock';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { EPersonMock } from '../testing/eperson.mock';
import { GroupMock } from '../testing/group-mock';
import { PaginationServiceStub } from '../testing/pagination-service.stub';
import { createTestComponent } from '../testing/utils.test';
import { EpersonGroupListComponent } from './eperson-group-list.component';
import { SearchEvent } from './eperson-group-list-event-type';
import { EpersonSearchBoxComponent } from './eperson-search-box/eperson-search-box.component';
import { GroupSearchBoxComponent } from './group-search-box/group-search-box.component';

const mockDataServiceMap: LazyDataServicesMap = new Map([
  [EPERSON.value, () => import('../../core/eperson/eperson-data.service').then(m => m.EPersonDataService)],
  [GROUP.value, () => import('../../core/eperson/group-data.service').then(m => m.GroupDataService)],
]);

describe('EpersonGroupListComponent', () => {
  let comp: EpersonGroupListComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<EpersonGroupListComponent>;
  let groupService: any;
  let epersonService: any;
  let paginationService: PaginationServiceStub;

  const paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
  paginationOptions.id = uniqueId('eperson-group-list-pagination-test');
  paginationOptions.pageSize = 5;

  const mockEpersonService = jasmine.createSpyObj('epersonService',
    {
      findByHref: jasmine.createSpy('findByHref'),
      findAll: jasmine.createSpy('findAll'),
      searchByScope: jasmine.createSpy('searchByScope'),
    },
    {
      linkPath: 'epersons',
    },
  );

  const mockGroupService = jasmine.createSpyObj('groupService',
    {
      findByHref: jasmine.createSpy('findByHref'),
      findAll: jasmine.createSpy('findAll'),
      searchGroups: jasmine.createSpy('searchGroups'),
    },
    {
      linkPath: 'groups',
    },
  );

  const epersonPaginatedList = buildPaginatedList(new PageInfo(), [EPersonMock, EPersonMock]);
  const epersonPaginatedListRD = createSuccessfulRemoteDataObject(epersonPaginatedList);

  const groupPaginatedList = buildPaginatedList(new PageInfo(), [GroupMock, GroupMock]);
  const groupPaginatedListRD = createSuccessfulRemoteDataObject(groupPaginatedList);

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        EpersonGroupListComponent,
        TestComponent,
        EpersonSearchBoxComponent,
        GroupSearchBoxComponent,
        PaginationComponent,
      ],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: EPersonDataService, useValue: mockEpersonService },
        { provide: GroupDataService, useValue: mockGroupService },
        { provide: RequestService, useValue: getMockRequestService() },
        { provide: PaginationService, useValue: paginationService },
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
        EpersonGroupListComponent,
        ChangeDetectorRef,
        Injector,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(EpersonGroupListComponent, {
        remove: {
          imports: [
            EpersonSearchBoxComponent,
            GroupSearchBoxComponent,
            PaginationComponent,
          ],
        },
      })
      .compileComponents();
  }));

  describe('', () => {
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      mockEpersonService.searchByScope.and.returnValue(of(epersonPaginatedListRD));
      const html = `
        <ds-eperson-group-list [isListOfEPerson]="isListOfEPerson" [initSelected]="initSelected"></ds-eperson-group-list>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create EpersonGroupListComponent', inject([EpersonGroupListComponent], (app: EpersonGroupListComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('when is list of eperson', () => {

    beforeEach(waitForAsync(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(EpersonGroupListComponent);
      epersonService = TestBed.inject(EPersonDataService);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
      comp.isListOfEPerson = true;
    }));

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture.destroy();
    });

    it('should inject EPersonDataService', fakeAsync(() => {
      spyOn(comp, 'updateList');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.dataService).toBeDefined();
        expect(comp.updateList).toHaveBeenCalled();
      });
    }));

    it('should init entrySelectedId', fakeAsync(async () => {
      spyOn(comp, 'updateList');
      comp.initSelected = EPersonMock.id;

      fixture.detectChanges();

      await fixture.whenStable();
      expect(comp.entrySelectedId$.value).toBe(EPersonMock.id);
    }));

    it('should init the list of eperson', fakeAsync(async () => {
      epersonService.searchByScope.and.returnValue(of(epersonPaginatedListRD));

      fixture.detectChanges();

      await fixture.whenStable();
      expect(comp.list$).toBeObservable(hot('(a|)', {
        a: epersonPaginatedList,
      }));
    }));

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(EPersonMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(comp.entrySelectedId$.value).toBe(EPersonMock.id);
    });

    it('should return the entrySelectedId$ value', () => {
      comp.entrySelectedId$.next(EPersonMock.id);

      expect(comp.entrySelectedId$.value).toBe(EPersonMock.id);
    });
  });

  describe('when is list of group', () => {

    beforeEach(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(EpersonGroupListComponent);
      groupService = TestBed.inject(GroupDataService);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
      comp.isListOfEPerson = false;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture.destroy();
    });

    it('should inject GroupDataService', fakeAsync(() => {
      spyOn(comp, 'updateList');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.dataService).toBeDefined();
        expect(comp.updateList).toHaveBeenCalled();
      });

    }));

    it('should init entrySelectedId', fakeAsync(async () => {
      spyOn(comp, 'updateList');
      comp.initSelected = GroupMock.id;

      fixture.detectChanges();

      await fixture.whenStable();
      expect(comp.entrySelectedId$.value).toBe(GroupMock.id);
    }));

    it('should init the list of group', fakeAsync(async () => {
      groupService.searchGroups.and.returnValue(of(groupPaginatedListRD));
      fixture.detectChanges();

      await fixture.whenStable();
      expect(comp.list$).toBeObservable(hot('(a|)', {
        a: groupPaginatedList,
      }));
    }));

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(GroupMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(comp.entrySelectedId$.value).toBe(GroupMock.id);
    });

    it('should return the entrySelectedId$ value', () => {
      comp.entrySelectedId$.next(GroupMock.id);

      expect(comp.entrySelectedId$.value).toBe(GroupMock.id);
    });

    it('should update list on search triggered', () => {
      const event: SearchEvent = {
        scope: 'metadata',
        query: 'test',
      };
      spyOn(comp, 'updateList');
      comp.onSearch(event);

      expect(comp.updateList).toHaveBeenCalledWith('metadata', 'test');
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
})
class TestComponent {

  isListOfEPerson = true;
  initSelected = '';
}

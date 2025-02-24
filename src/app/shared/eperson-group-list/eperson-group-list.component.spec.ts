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
import {
  APP_DATA_SERVICES_MAP,
  buildPaginatedList,
  createSuccessfulRemoteDataObject,
  createTestComponent,
  DSONameService,
  EPERSON,
  EPersonDataService,
  EPersonMock,
  getMockRequestService,
  GROUP,
  GroupDataService,
  GroupMock,
  LazyDataServicesMap,
  PageInfo,
  PaginationComponentOptions,
  PaginationService,
  PaginationServiceStub,
  RequestService,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import uniqueId from 'lodash/uniqueId';
import { of as observableOf } from 'rxjs';

import { DSONameServiceMock } from '../mocks/dso-name.service.mock';
import { PaginationComponent } from '../pagination/pagination.component';
import { EpersonGroupListComponent } from './eperson-group-list.component';
import { SearchEvent } from './eperson-group-list-event-type';
import { EpersonSearchBoxComponent } from './eperson-search-box/eperson-search-box.component';
import { GroupSearchBoxComponent } from './group-search-box/group-search-box.component';

const mockDataServiceMap: LazyDataServicesMap = new Map([
  [EPERSON.value, () => import('../../../../modules/core/src/lib/core/eperson/eperson-data.service').then(m => m.EPersonDataService)],
  [GROUP.value, () => import('../../../../modules/core/src/lib/core/eperson/group-data.service').then(m => m.GroupDataService)],
]);

describe('EpersonGroupListComponent test suite', () => {
  let comp: EpersonGroupListComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<EpersonGroupListComponent>;
  let de;
  let groupService: any;
  let epersonService: any;
  let paginationService;

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
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      mockEpersonService.searchByScope.and.returnValue(observableOf(epersonPaginatedListRD));
      const html = `
        <ds-eperson-group-list [isListOfEPerson]="isListOfEPerson" [initSelected]="initSelected"></ds-eperson-group-list>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
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
      de = null;
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

    it('should init entrySelectedId', fakeAsync(() => {
      spyOn(comp, 'updateList');
      comp.initSelected = EPersonMock.id;

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.entrySelectedId.value).toBe(EPersonMock.id);
      });

    }));

    it('should init the list of eperson', fakeAsync(() => {
      epersonService.searchByScope.and.returnValue(observableOf(epersonPaginatedListRD));

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.list$.value).toEqual(epersonPaginatedListRD);
        expect(comp.getList()).toBeObservable(cold('a', {
          a: epersonPaginatedListRD,
        }));
      });
    }));

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(EPersonMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(compAsAny.entrySelectedId.value).toBe(EPersonMock.id);
    });

    it('should return true when entry is selected', () => {
      compAsAny.entrySelectedId.next(EPersonMock.id);

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: true,
      }));
    });

    it('should return false when entry is not selected', () => {
      compAsAny.entrySelectedId.next('');

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: false,
      }));
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
      de = null;
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

    it('should init entrySelectedId', fakeAsync(() => {
      spyOn(comp, 'updateList');
      comp.initSelected = GroupMock.id;

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.entrySelectedId.value).toBe(GroupMock.id);
      });
    }));

    it('should init the list of group', fakeAsync(() => {
      groupService.searchGroups.and.returnValue(observableOf(groupPaginatedListRD));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.list$.value).toEqual(groupPaginatedListRD);
        expect(comp.getList()).toBeObservable(cold('a', {
          a: groupPaginatedListRD,
        }));
      });
    }));

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(GroupMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(compAsAny.entrySelectedId.value).toBe(GroupMock.id);
    });

    it('should return true when entry is selected', () => {
      compAsAny.entrySelectedId.next(EPersonMock.id);

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: true,
      }));
    });

    it('should return false when entry is not selected', () => {
      compAsAny.entrySelectedId.next('');

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: false,
      }));
    });

    it('should update list on search triggered', () => {
      const options: PaginationComponentOptions = comp.paginationOptions;
      const event: SearchEvent = {
        scope: 'metadata',
        query: 'test',
      };
      spyOn(comp, 'updateList');
      comp.onSearch(event);

      expect(compAsAny.updateList).toHaveBeenCalledWith('metadata', 'test');
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

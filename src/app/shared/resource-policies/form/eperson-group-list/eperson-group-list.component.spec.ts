import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Component, Injector, NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { uniqueId } from 'lodash';

import { createSuccessfulRemoteDataObject, createTestComponent } from '../../../testing/utils';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { RequestService } from '../../../../core/data/request.service';
import { getMockRequestService } from '../../../mocks/mock-request.service';
import { EpersonGroupListComponent } from './eperson-group-list.component';
import { EPersonMock } from '../../../testing/eperson-mock';
import { GroupMock } from '../../../testing/group-mock';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';

describe('EpersonGroupListComponent test suite', () => {
  let comp: EpersonGroupListComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<EpersonGroupListComponent>;
  let de;
  let scheduler: TestScheduler;

  const paginationOptions: PaginationComponentOptions = new PaginationComponentOptions()
  paginationOptions.id = uniqueId('eperson-group-list-pagination-test');
  paginationOptions.pageSize = 5;

  const epersonService = jasmine.createSpyObj('epersonService',
    {
      findByHref: jasmine.createSpy('findByHref'),
      findAll: jasmine.createSpy('findAll'),
    },
    {
      linkPath: 'epersons'
    }
  );

  const groupService = jasmine.createSpyObj('groupService',
    {
      findByHref: jasmine.createSpy('findByHref'),
      findAll: jasmine.createSpy('findAll'),
    },
    {
      linkPath: 'groups'
    }
  );

  const epersonPaginatedList = new PaginatedList(new PageInfo(), [EPersonMock, EPersonMock]);
  const epersonPaginatedListRD = createSuccessfulRemoteDataObject(epersonPaginatedList);

  const groupPaginatedList = new PaginatedList(new PageInfo(), [GroupMock, GroupMock]);
  const groupPaginatedListRD = createSuccessfulRemoteDataObject(groupPaginatedList);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        EpersonGroupListComponent,
        TestComponent
      ],
      providers: [
        { provide: EPersonDataService, useValue: epersonService },
        { provide: GroupDataService, useValue: groupService },
        { provide: RequestService, useValue: getMockRequestService() },
        EpersonGroupListComponent,
        ChangeDetectorRef,
        Injector
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
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

    beforeEach(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(EpersonGroupListComponent);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
      comp.isListOfEPerson = true;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      de = null;
      fixture.destroy();
    });

    it('should inject EPersonDataService', () => {
      spyOn(comp, 'updateList');
      fixture.detectChanges();

      expect(compAsAny.dataService).toBeDefined();
      expect(comp.updateList).toHaveBeenCalled();
    });

    it('should init entrySelectedId', () => {
      spyOn(comp, 'updateList');
      comp.initSelected = EPersonMock.id;

      fixture.detectChanges();

      expect(compAsAny.entrySelectedId.value).toBe(EPersonMock.id)
    });

    it('should init the list of eperson', () => {
      compAsAny.dataService.findAll.and.returnValue(observableOf(epersonPaginatedListRD));

      scheduler = getTestScheduler();
      scheduler.schedule(() => comp.updateList(paginationOptions));
      scheduler.flush();

      expect(compAsAny.list$.value).toEqual(epersonPaginatedListRD);
      expect(comp.getList()).toBeObservable(cold('a', {
        a: epersonPaginatedListRD
      }));
    });

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(EPersonMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(compAsAny.entrySelectedId.value).toBe(EPersonMock.id);
    });

    it('should return true when entry is selected', () => {
      compAsAny.entrySelectedId.next(EPersonMock.id);

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: true
      }));
    });

    it('should return false when entry is not selected', () => {
      compAsAny.entrySelectedId.next('');

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: false
      }));
    });

    it('should update list on page change', () => {
      spyOn(comp, 'updateList');
      comp.onPageChange(2);

      expect(compAsAny.updateList).toHaveBeenCalled();
    });
  });

  describe('when is list of group', () => {

    beforeEach(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(EpersonGroupListComponent);
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

    it('should inject GroupDataService', () => {
      spyOn(comp, 'updateList');
      fixture.detectChanges();

      expect(compAsAny.dataService).toBeDefined();
      expect(comp.updateList).toHaveBeenCalled();
    });

    it('should init entrySelectedId', () => {
      spyOn(comp, 'updateList');
      comp.initSelected = GroupMock.id;

      fixture.detectChanges();

      expect(compAsAny.entrySelectedId.value).toBe(GroupMock.id)
    });

    it('should init the list of group', () => {
      compAsAny.dataService.findAll.and.returnValue(observableOf(groupPaginatedListRD));

      scheduler = getTestScheduler();
      scheduler.schedule(() => comp.updateList(paginationOptions));
      scheduler.flush();

      expect(compAsAny.list$.value).toEqual(groupPaginatedListRD);
      expect(comp.getList()).toBeObservable(cold('a', {
        a: groupPaginatedListRD
      }));
    });

    it('should emit select event', () => {
      spyOn(comp.select, 'emit');
      comp.emitSelect(GroupMock);

      expect(comp.select.emit).toHaveBeenCalled();
      expect(compAsAny.entrySelectedId.value).toBe(GroupMock.id);
    });

    it('should return true when entry is selected', () => {
      compAsAny.entrySelectedId.next(EPersonMock.id);

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: true
      }));
    });

    it('should return false when entry is not selected', () => {
      compAsAny.entrySelectedId.next('');

      expect(comp.isSelected(EPersonMock)).toBeObservable(cold('a', {
        a: false
      }));
    });

    it('should update list on page change', () => {
      spyOn(comp, 'updateList');
      comp.onPageChange(2);

      expect(compAsAny.updateList).toHaveBeenCalled();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  isListOfEPerson = true;
  initSelected = '';
}

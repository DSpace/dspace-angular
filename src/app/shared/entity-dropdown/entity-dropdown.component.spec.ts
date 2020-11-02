import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EntityDropdownComponent } from './entity-dropdown.component';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { Observable, of } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { getTestScheduler } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, ElementRef } from '@angular/core';
import { EntityTypeService } from '../../core/data/entity-type.service';
import { FindListOptions } from 'src/app/core/data/request.models';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { TestScheduler } from 'rxjs/testing';
import { By } from '@angular/platform-browser';

const entities: ItemType[] = [
  Object.assign(new ItemType(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    label: 'Entity 1',
    uuid: 'UUID-ce64f48e-2c9b-411a-ac36-ee429c0e6a88'
  }),
  Object.assign(new ItemType(), {
    id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
    label: 'Entity 2',
    uuid: 'UUID-59ee713b-ee53-4220-8c3f-9860dc84fe33'
  }),
  Object.assign(new ItemType(), {
    id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
    label: 'Entity 3',
    uuid: 'UUID-7127-415f-8919-55be34a6e9ed'
  }),
  Object.assign(new ItemType(), {
    id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
    label: 'Entity 4',
    uuid: 'UUID-59da2ff0-9bf4-45bf-88be-e35abd33f304'
  }),
  Object.assign(new ItemType(), {
    id: 'a5159760-f362-4659-9e81-e3253ad91ede',
    label: 'Entity 5',
    uuid: 'UUID-a5159760-f362-4659-9e81-e3253ad91ede'
  })
];

const listElementMock: ItemType = Object.assign(
  new ItemType(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    label: 'Entity 1',
    uuid: 'UUID-ce64f48e-2c9b-411a-ac36-ee429c0e6a88'
  }
);

// tslint:disable-next-line: max-classes-per-file
class EntityTypeServiceMock {
  getAllAuthorizedRelationshipType(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<ItemType>>): Observable<RemoteData<PaginatedList<ItemType>>> {
    return of(
        createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), entities)
        )
    );
  };
  getAllAuthorizedRelationshipTypeImport(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<ItemType>>): Observable<RemoteData<PaginatedList<ItemType>>> {
    return of(
        createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), entities)
        )
    );
  };
}

describe('EntityDropdownComponent', () => {
  let component: EntityDropdownComponent;
  let fixture: ComponentFixture<EntityDropdownComponent>;
  let scheduler: TestScheduler;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ EntityDropdownComponent ],
      providers: [
        {provide: EntityTypeService, useClass: EntityTypeServiceMock},
        {provide: ChangeDetectorRef, useValue: {}},
        {provide: ElementRef, userValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(EntityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.isSubmission = false;
  });

  it('should populate entities list with five items', () => {
    const elements = fixture.debugElement.queryAll(By.css('.entity-item'));
    expect(elements.length).toEqual(5);
  });

  it('should trigger onSelect method when select a new entity from list', fakeAsync(() => {
    spyOn(component, 'onSelect');
    const entityItem = fixture.debugElement.query(By.css('.entity-item:nth-child(2)'));
    entityItem.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(component.onSelect).toHaveBeenCalled();
    });
  }));

  it('should init component with entity list', fakeAsync(() => {
    spyOn(component.subs, 'push').and.callThrough();
    spyOn(component, 'resetPagination').and.callThrough();
    spyOn(component, 'populateEntityList').and.callThrough();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.subs.push).toHaveBeenCalled();
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.populateEntityList).toHaveBeenCalled();
    });
  }));

  it('should emit selectionChange event when selecting a new entity', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();
    component.ngOnInit();
    component.onSelect(listElementMock as any);
    fixture.detectChanges();

    expect(component.selectionChange.emit).toHaveBeenCalledWith(listElementMock as any);
  });

  it('should change loader status', () => {
    spyOn(component.isLoadingList, 'next').and.callThrough();
    component.hideShowLoader(true);

    expect(component.isLoadingList.next).toHaveBeenCalledWith(true);
  });

  it('reset pagination fields', () => {
    component.resetPagination();

    expect(component.currentPage).toEqual(1);
    expect(component.hasNextPage).toEqual(true);
    expect(component.searchListEntity).toEqual([]);
  });

  it('should invoke the method getAllAuthorizedRelationshipType of EntityTypeService', fakeAsync(() => {
    component.isSubmission = true;
    spyOn((component as any).entityTypeService, 'getAllAuthorizedRelationshipType').and.returnValue(
      of(
        createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), entities)
        )
      )
    );
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect((component as any).entityTypeService.getAllAuthorizedRelationshipType).toHaveBeenCalled();
    });
  }));

  it('should invoke the method getAllAuthorizedRelationshipTypeImport of EntityTypeService', fakeAsync(() => {
    component.isSubmission = false;
    spyOn((component as any).entityTypeService, 'getAllAuthorizedRelationshipTypeImport').and.returnValue(
      of(
        createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), entities)
        )
      )
    );
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect((component as any).entityTypeService.getAllAuthorizedRelationshipTypeImport).toHaveBeenCalled();
    });
  }));
});

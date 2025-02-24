import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createPaginatedList,
  createSuccessfulRemoteDataObject$,
  EntityTypeDataService,
  ItemType,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TestScheduler } from 'rxjs/testing';

import { ThemedLoadingComponent } from '../loading/themed-loading.component';
import { EntityDropdownComponent } from './entity-dropdown.component';

@Pipe({
  // eslint-disable-next-line @angular-eslint/pipe-prefix
  name: 'translate',
  standalone: true,
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const entities: ItemType[] = [
  Object.assign(new ItemType(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    label: 'Entity_1',
    uuid: 'UUID-ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  }),
  Object.assign(new ItemType(), {
    id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
    label: 'Entity_2',
    uuid: 'UUID-59ee713b-ee53-4220-8c3f-9860dc84fe33',
  }),
  Object.assign(new ItemType(), {
    id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
    label: 'Entity_3',
    uuid: 'UUID-7127-415f-8919-55be34a6e9ed',
  }),
  Object.assign(new ItemType(), {
    id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
    label: 'Entity_4',
    uuid: 'UUID-59da2ff0-9bf4-45bf-88be-e35abd33f304',
  }),
  Object.assign(new ItemType(), {
    id: 'a5159760-f362-4659-9e81-e3253ad91ede',
    label: 'Entity_5',
    uuid: 'UUID-a5159760-f362-4659-9e81-e3253ad91ede',
  }),
];

const listElementMock: ItemType = Object.assign(
  new ItemType(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    label: 'Entity_1',
    uuid: 'UUID-ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  },
);

describe('EntityDropdownComponent', () => {
  let component: EntityDropdownComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<EntityDropdownComponent>;
  let scheduler: TestScheduler;

  const entityTypeServiceMock: any = jasmine.createSpyObj('EntityTypeService', {
    getAllAuthorizedRelationshipType: jasmine.createSpy('getAllAuthorizedRelationshipType'),
    getAllAuthorizedRelationshipTypeImport: jasmine.createSpy('getAllAuthorizedRelationshipTypeImport'),
  });


  let translatePipeSpy: jasmine.Spy;

  const paginatedEntities = createPaginatedList(entities);
  const paginatedEntitiesRD$ = createSuccessfulRemoteDataObject$(paginatedEntities);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        EntityDropdownComponent,
        MockTranslatePipe,
        InfiniteScrollModule,
        ThemedLoadingComponent,
        AsyncPipe,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: EntityTypeDataService, useValue: entityTypeServiceMock },
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(EntityDropdownComponent, {
        add: {
          imports: [MockTranslatePipe],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(EntityDropdownComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    componentAsAny.entityTypeService.getAllAuthorizedRelationshipType.and.returnValue(paginatedEntitiesRD$);
    componentAsAny.entityTypeService.getAllAuthorizedRelationshipTypeImport.and.returnValue(paginatedEntitiesRD$);
    component.isSubmission = true;

    translatePipeSpy = spyOn(MockTranslatePipe.prototype, 'transform');
  });

  it('should translate entries', () => {
    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    expect(translatePipeSpy).toHaveBeenCalledWith('entity_1.listelement.badge');
  });

  it('should init component with entities list', () => {
    spyOn(component.subs, 'push');
    spyOn(component, 'resetPagination');
    spyOn(component, 'populateEntityList').and.callThrough();

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();
    const elements = fixture.debugElement.queryAll(By.css('.entity-item'));

    expect(elements.length).toEqual(5);
    expect(component.subs.push).toHaveBeenCalled();
    expect(component.resetPagination).toHaveBeenCalled();
    expect(component.populateEntityList).toHaveBeenCalled();
    expect((component as any).entityTypeService.getAllAuthorizedRelationshipType).toHaveBeenCalled();
  });

  it('should trigger onSelect method when select a new entity from list', () => {
    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    spyOn(component, 'onSelect');
    const entityItem = fixture.debugElement.query(By.css('.entity-item:nth-child(2) button'));
    entityItem.triggerEventHandler('click', null);

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    expect(component.onSelect).toHaveBeenCalled();
  });

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

  it('should invoke the method getAllAuthorizedRelationshipTypeImport of EntityTypeService when isSubmission is false', () => {
    component.isSubmission = false;

    scheduler.schedule(() => fixture.detectChanges());
    scheduler.flush();

    expect((component as any).entityTypeService.getAllAuthorizedRelationshipTypeImport).toHaveBeenCalled();
  });
});

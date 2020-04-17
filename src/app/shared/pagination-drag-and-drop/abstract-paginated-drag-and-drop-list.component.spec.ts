import { AbstractPaginatedDragAndDropListComponent } from './abstract-paginated-drag-and-drop-list.component';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ObjectUpdatesService } from '../../core/data/object-updates/object-updates.service';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FieldUpdates } from '../../core/data/object-updates/object-updates.reducer';
import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';
import { PaginationComponent } from '../pagination/pagination.component';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { createPaginatedList } from '../testing/utils.test';

class MockAbstractPaginatedDragAndDropListComponent extends AbstractPaginatedDragAndDropListComponent<DSpaceObject> {

  constructor(protected objectUpdatesService: ObjectUpdatesService,
              protected elRef: ElementRef,
              protected mockUrl: string,
              protected mockObjectsRD$: Observable<RemoteData<PaginatedList<DSpaceObject>>>) {
    super(objectUpdatesService, elRef);
  }

  initializeObjectsRD(): void {
    this.objectsRD$ = this.mockObjectsRD$;
  }

  initializeURL(): void {
    this.url = this.mockUrl;
  }
}

describe('AbstractPaginatedDragAndDropListComponent', () => {
  let component: MockAbstractPaginatedDragAndDropListComponent;
  let objectUpdatesService: ObjectUpdatesService;
  let elRef: ElementRef;

  const url = 'mock-abstract-paginated-drag-and-drop-list-component';

  const object1 = Object.assign(new DSpaceObject(), { uuid: 'object-1' });
  const object2 = Object.assign(new DSpaceObject(), { uuid: 'object-2' });
  const objectsRD = createSuccessfulRemoteDataObject(createPaginatedList([object1, object2]));
  let objectsRD$: BehaviorSubject<RemoteData<PaginatedList<DSpaceObject>>>;

  const updates = {
    [object1.uuid]: { field: object1, changeType: undefined },
    [object2.uuid]: { field: object2, changeType: undefined }
  } as FieldUpdates;

  let paginationComponent: PaginationComponent;

  beforeEach(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService', {
      initializeWithCustomOrder: {},
      addPageToCustomOrder: {},
      getFieldUpdatesByCustomOrder: observableOf(updates),
      saveMoveFieldUpdate: {}
    });
    elRef = {
      nativeElement: jasmine.createSpyObj('nativeElement', {
        querySelector: {}
      })
    };
    paginationComponent = jasmine.createSpyObj('paginationComponent', {
      doPageChange: {}
    });
    objectsRD$ = new BehaviorSubject(objectsRD);
    component = new MockAbstractPaginatedDragAndDropListComponent(objectUpdatesService, elRef, url, objectsRD$);
    component.paginationComponent = paginationComponent;
    component.ngOnInit();
  });

  it('should call initializeWithCustomOrder to initialize the first page and add it to initializedPages', (done) => {
    expect(component.initializedPages.indexOf(0)).toBeLessThan(0);
    component.updates$.pipe(take(1)).subscribe(() => {
      expect(objectUpdatesService.initializeWithCustomOrder).toHaveBeenCalled();
      expect(component.initializedPages.indexOf(0)).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should initialize the updates correctly', (done) => {
    component.updates$.pipe(take(1)).subscribe((fieldUpdates) => {
      expect(fieldUpdates).toEqual(updates);
      done();
    });
  });

  describe('when a new page is loaded', () => {
    const page = 5;

    beforeEach((done) => {
      component.updates$.pipe(take(1)).subscribe(() => {
        component.currentPage$.next(page);
        objectsRD$.next(objectsRD);
        done();
      });
    });

    it('should call addPageToCustomOrder to initialize the new page and add it to initializedPages', (done) => {
      component.updates$.pipe(take(1)).subscribe(() => {
        expect(objectUpdatesService.addPageToCustomOrder).toHaveBeenCalled();
        expect(component.initializedPages.indexOf(page - 1)).toBeGreaterThanOrEqual(0);
        done();
      });
    });

    describe('twice', () => {
      beforeEach((done) => {
        component.updates$.pipe(take(1)).subscribe(() => {
          component.currentPage$.next(page);
          objectsRD$.next(objectsRD);
          done();
        });
      });

      it('shouldn\'t call addPageToCustomOrder again, as the page has already been initialized', (done) => {
        component.updates$.pipe(take(1)).subscribe(() => {
          expect(objectUpdatesService.addPageToCustomOrder).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });

  describe('switchPage', () => {
    const page = 3;

    beforeEach(() => {
      component.switchPage(page);
    });

    it('should set currentPage$ to the new page', () => {
      expect(component.currentPage$.value).toEqual(page);
    });
  });

  describe('drop', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1,
      item: { element: { nativeElement: { id: object1.uuid } } }
    } as any;

    describe('when the user is hovering over a new page', () => {
      const hoverPage = 3;
      const hoverElement = { textContent: '' + hoverPage };

      beforeEach(() => {
        elRef.nativeElement.querySelector.and.returnValue(hoverElement);
        component.initializedPages.push(hoverPage - 1);
        component.drop(event);
      });

      it('should detect the page and set currentPage$ to its value', () => {
        expect(component.currentPage$.value).toEqual(hoverPage);
      });

      it('should detect the page and update the pagination component with its value', () => {
        expect(paginationComponent.doPageChange).toHaveBeenCalledWith(hoverPage);
      });

      it('should send out a saveMoveFieldUpdate with the correct values', () => {
        expect(objectUpdatesService.saveMoveFieldUpdate).toHaveBeenCalledWith(url, event.previousIndex, 0, 0, hoverPage - 1, object1);
      });
    });

    describe('when the user is not hovering over a new page', () => {
      beforeEach(() => {
        component.drop(event);
      });

      it('should send out a saveMoveFieldUpdate with the correct values', () => {
        expect(objectUpdatesService.saveMoveFieldUpdate).toHaveBeenCalledWith(url, event.previousIndex, event.currentIndex, 0, 0);
      });
    });
  });
});

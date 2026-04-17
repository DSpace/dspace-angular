import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ErrorComponent } from '../error/error.component';
import { ThemedLoadingComponent } from '../loading/themed-loading.component';
import { TabulatableObjectsLoaderComponent } from '../object-collection/shared/tabulatable-objects/tabulatable-objects-loader.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRouteStub } from '../testing/active-router.stub';
import { ObjectTableComponent } from './object-table.component';

describe('ObjectTableComponent', () => {
  let component: ObjectTableComponent;
  let fixture: ComponentFixture<ObjectTableComponent>;
  const testEvent: any = { test: 'test' };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectTableComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    })
      .overrideComponent(ObjectTableComponent, {
        remove: {
          imports: [
            PaginationComponent,
            ThemedLoadingComponent,
            ErrorComponent,
            TabulatableObjectsLoaderComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('when the pageChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(component, 'onPageChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('pageChange', testEvent);
    });

    it('should call onPageChange on the componentonent', () => {
      expect(component.onPageChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the pageSizeChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(component, 'onPageSizeChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('pageSizeChange', testEvent);
    });

    it('should call onPageSizeChange on the componentonent', () => {
      expect(component.onPageSizeChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the sortDirectionChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(component, 'onSortDirectionChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('sortDirectionChange', testEvent);
    });

    it('should call onSortDirectionChange on the componentonent', () => {
      expect(component.onSortDirectionChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the sortFieldChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(component, 'onSortFieldChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('sortFieldChange', testEvent);
    });

    it('should call onSortFieldChange on the componentonent', () => {
      expect(component.onSortFieldChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the paginationChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(component, 'onPaginationChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('paginationChange', testEvent);
    });

    it('should call onPaginationChange on the componentonent', () => {
      expect(component.onPaginationChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when onPageChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(component.pageChange, 'emit');
      component.onPageChange(testEvent);
    });

    it('should emit the value from the pageChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(component.pageChange.emit).toHaveBeenCalled();
      expect(component.pageChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onPageSizeChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(component.pageSizeChange, 'emit');
      component.onPageSizeChange(testEvent);
    });

    it('should emit the value from the pageSizeChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(component.pageSizeChange.emit).toHaveBeenCalled();
      expect(component.pageSizeChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onSortDirectionChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(component.sortDirectionChange, 'emit');
      component.onSortDirectionChange(testEvent);
    });

    it('should emit the value from the sortDirectionChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(component.sortDirectionChange.emit).toHaveBeenCalled();
      expect(component.sortDirectionChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onSortFieldChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(component.sortFieldChange, 'emit');
      component.onSortFieldChange(testEvent);
    });

    it('should emit the value from the sortFieldChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(component.sortFieldChange.emit).toHaveBeenCalled();
      expect(component.sortFieldChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onPaginationChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(component.paginationChange, 'emit');
      component.onPaginationChange(testEvent);
    });

    it('should emit the value from the paginationChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(component.paginationChange.emit).toHaveBeenCalled();
      expect(component.paginationChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });
});

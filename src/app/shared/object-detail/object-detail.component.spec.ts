import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ObjectDetailComponent } from './object-detail.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../mocks/mock-translate-loader';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSuccessfulRemoteDataObject } from '../testing/utils';

describe('ObjectDetailComponent', () => {
  let comp: ObjectDetailComponent;
  let fixture: ComponentFixture<ObjectDetailComponent>;
  const testEvent = {test: 'test'};

  const testObjects = [
    { one: 1 },
    { two: 2 },
    { three: 3 },
    { four: 4 },
    { five: 5 },
    { six: 6 },
    { seven: 7 },
    { eight: 8 },
    { nine: 9 },
    { ten: 10 }
  ];
  const pageInfo = Object.assign(new PageInfo(), {elementsPerPage: 1, totalElements: 10, totalPages: 10, currentPage: 1})
  const mockRD = createSuccessfulRemoteDataObject(new PaginatedList(pageInfo, testObjects));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [ObjectDetailComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ObjectDetailComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDetailComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.objects = mockRD;
    fixture.detectChanges();
  });

  describe('when the pageChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(comp, 'onPageChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('pageChange', testEvent);
    });

    it('should call onPageChange on the component', () => {
      expect(comp.onPageChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the pageSizeChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(comp, 'onPageSizeChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('pageSizeChange', testEvent);
    });

    it('should call onPageSizeChange on the component', () => {
      expect(comp.onPageSizeChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the sortDirectionChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(comp, 'onSortDirectionChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('sortDirectionChange', testEvent);
    });

    it('should call onSortDirectionChange on the component', () => {
      expect(comp.onSortDirectionChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the sortFieldChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(comp, 'onSortFieldChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('sortFieldChange', testEvent);
    });

    it('should call onSortFieldChange on the component', () => {
      expect(comp.onSortFieldChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when the paginationChange output on the pagination is triggered', () => {
    beforeEach(() => {
      spyOn(comp, 'onPaginationChange');
      const paginationEl = fixture.debugElement.query(By.css('ds-pagination'));
      paginationEl.triggerEventHandler('paginationChange', testEvent);
    });

    it('should call onPaginationChange on the component', () => {
      expect(comp.onPaginationChange).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('when onPageChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(comp.pageChange, 'emit');
      comp.onPageChange(testEvent);
    });

    it('should emit the value from the pageChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(comp.pageChange.emit).toHaveBeenCalled();
      expect(comp.pageChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onPageSizeChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(comp.pageSizeChange, 'emit');
      comp.onPageSizeChange(testEvent);
    });

    it('should emit the value from the pageSizeChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(comp.pageSizeChange.emit).toHaveBeenCalled();
      expect(comp.pageSizeChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onSortDirectionChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(comp.sortDirectionChange, 'emit');
      comp.onSortDirectionChange(testEvent);
    });

    it('should emit the value from the sortDirectionChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(comp.sortDirectionChange.emit).toHaveBeenCalled();
      expect(comp.sortDirectionChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onSortFieldChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(comp.sortFieldChange, 'emit');
      comp.onSortFieldChange(testEvent);
    });

    it('should emit the value from the sortFieldChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(comp.sortFieldChange.emit).toHaveBeenCalled();
      expect(comp.sortFieldChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });

  describe('when onPaginationChange is triggered with an event', () => {
    beforeEach(() => {
      spyOn(comp.paginationChange, 'emit');
      comp.onPaginationChange(testEvent);
    });

    it('should emit the value from the paginationChange EventEmitter', fakeAsync(() => {
      tick(1);
      expect(comp.paginationChange.emit).toHaveBeenCalled();
      expect(comp.paginationChange.emit).toHaveBeenCalledWith(testEvent);
    }));
  });
});

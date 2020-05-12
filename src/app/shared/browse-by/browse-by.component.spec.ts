import { BrowseByComponent } from './browse-by.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { storeModuleConfig } from '../../app.reducer';

describe('BrowseByComponent', () => {
  let comp: BrowseByComponent;
  let fixture: ComponentFixture<BrowseByComponent>;

  const mockItems = [
    Object.assign(new Item(), {
      id: 'fakeId-1',
      metadata: [
        {
          key: 'dc.title',
          value: 'First Fake Title'
        }
      ]
    }),
    Object.assign(new Item(), {
      id: 'fakeId-2',
      metadata: [
        {
          key: 'dc.title',
          value: 'Second Fake Title'
        }
      ]
    })
  ];
  const mockItemsRD$ = createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), mockItems));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        SharedModule,
        NgbModule,
        StoreModule.forRoot({}, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByComponent);
    comp = fixture.componentInstance;
  });

  it('should display a loading message when objects is empty',() => {
    (comp as any).objects = undefined;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-loading'))).toBeDefined();
  });

  it('should display results when objects is not empty', () => {
    (comp as any).objects = observableOf({
      payload: {
        page: {
          length: 1
        }
      }
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-viewable-collection'))).toBeDefined();
  });

  describe('when enableArrows is true and objects are defined', () => {
    beforeEach(() => {
      comp.enableArrows = true;
      comp.objects$ = mockItemsRD$;
      comp.paginationConfig = Object.assign(new PaginationComponentOptions(), {
        id: 'test-pagination',
        currentPage: 1,
        pageSizeOptions: [5,10,15,20],
        pageSize: 15
      });
      comp.sortConfig = Object.assign(new SortOptions('dc.title', SortDirection.ASC));
      fixture.detectChanges();
    });

    describe('when clicking the previous arrow button', () => {
      beforeEach(() => {
        spyOn(comp.prev, 'emit');
        fixture.debugElement.query(By.css('#nav-prev')).triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('should emit a signal to the EventEmitter',() => {
        expect(comp.prev.emit).toHaveBeenCalled();
      });
    });

    describe('when clicking the next arrow button', () => {
      beforeEach(() => {
        spyOn(comp.next, 'emit');
        fixture.debugElement.query(By.css('#nav-next')).triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('should emit a signal to the EventEmitter',() => {
        expect(comp.next.emit).toHaveBeenCalled();
      });
    });

    describe('when clicking a different page size', () => {
      beforeEach(() => {
        spyOn(comp.pageSizeChange, 'emit');
        fixture.debugElement.query(By.css('.page-size-change')).triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('should emit a signal to the EventEmitter',() => {
        expect(comp.pageSizeChange.emit).toHaveBeenCalled();
      });
    });

    describe('when clicking a different sort direction', () => {
      beforeEach(() => {
        spyOn(comp.sortDirectionChange, 'emit');
        fixture.debugElement.query(By.css('.sort-direction-change')).triggerEventHandler('click', null);
        fixture.detectChanges();
      });

      it('should emit a signal to the EventEmitter',() => {
        expect(comp.sortDirectionChange.emit).toHaveBeenCalled();
      });
    });
  });

});

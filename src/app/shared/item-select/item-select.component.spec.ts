import { ItemSelectComponent } from './item-select.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SharedModule } from '../shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ItemSelectService } from './item-select.service';
import { ItemSelectServiceStub } from '../testing/item-select-service-stub';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { Item } from '../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ActivatedRouteStub } from '../testing/active-router-stub';
import { RouterStub } from '../testing/router-stub';
import { HostWindowService } from '../host-window.service';
import { HostWindowServiceStub } from '../testing/host-window-service-stub';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('ItemSelectComponent', () => {
  let comp: ItemSelectComponent;
  let fixture: ComponentFixture<ItemSelectComponent>;
  let itemSelectService: ItemSelectService;

  const mockItemList = [
    Object.assign(new Item(), {
      id: 'id1',
      bitstreams: Observable.of({}),
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'This is just a title'
        },
        {
          key: 'dc.type',
          language: null,
          value: 'Article'
        }]
    }),
    Object.assign(new Item(), {
      id: 'id2',
      bitstreams: Observable.of({}),
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'This is just another title'
        },
        {
          key: 'dc.type',
          language: null,
          value: 'Article'
        }]
    })
  ];
  const mockItems = Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), mockItemList)));
  const mockPaginationOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'search-page-configuration',
    pageSize: 10,
    currentPage: 1
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, RouterTestingModule.withRoutes([])],
      declarations: [],
      providers: [
        { provide: ItemSelectService, useValue: new ItemSelectServiceStub() },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectComponent);
    comp = fixture.componentInstance;
    comp.itemsRD$ = mockItems;
    comp.paginationOptions = mockPaginationOptions;
    fixture.detectChanges();
    itemSelectService = (comp as any).itemSelectService;
  });

  it(`should show a list of ${mockItemList.length} items`, () => {
    const tbody: HTMLElement = fixture.debugElement.query(By.css('table#item-select tbody')).nativeElement;
    expect(tbody.children.length).toBe(mockItemList.length);
  });

  describe('checkboxes', () => {
    let checkbox: HTMLInputElement;

    beforeEach(() => {
      checkbox = fixture.debugElement.query(By.css('input.item-checkbox')).nativeElement;
    });

    it('should initially be unchecked',() => {
      expect(checkbox.checked).toBeFalsy();
    });

    it('should be checked when clicked', () => {
      checkbox.click();
      fixture.detectChanges();
      expect(checkbox.checked).toBeTruthy();
    });

    it('should switch the value through item-select-service', () => {
      spyOn((comp as any).itemSelectService, 'switch').and.callThrough();
      checkbox.click();
      expect((comp as any).itemSelectService.switch).toHaveBeenCalled();
    });
  });

  describe('when confirm is clicked', () => {
    let confirmButton: HTMLButtonElement;

    beforeEach(() => {
      confirmButton = fixture.debugElement.query(By.css('button.item-confirm')).nativeElement;
      spyOn(comp.confirm, 'emit').and.callThrough();
    });

    it('should emit the selected items',() => {
      confirmButton.click();
      expect(comp.confirm.emit).toHaveBeenCalled();
    });
  });
});

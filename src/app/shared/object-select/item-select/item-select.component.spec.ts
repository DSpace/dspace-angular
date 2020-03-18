import { ItemSelectComponent } from './item-select.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { ObjectSelectServiceStub } from '../../testing/object-select-service.stub';
import { ObjectSelectService } from '../object-select.service';
import { HostWindowService } from '../../host-window.service';
import { HostWindowServiceStub } from '../../testing/host-window-service.stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';

describe('ItemSelectComponent', () => {
  let comp: ItemSelectComponent;
  let fixture: ComponentFixture<ItemSelectComponent>;
  let objectSelectService: ObjectSelectService;

  const mockItemList = [
    Object.assign(new Item(), {
      id: 'id1',
      bundles: of({}),
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
      bundles: of({}),
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
  const mockItems = of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), mockItemList)));
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
        { provide: ObjectSelectService, useValue: new ObjectSelectServiceStub([mockItemList[1].id]) },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectComponent);
    comp = fixture.componentInstance;
    comp.dsoRD$ = mockItems;
    comp.paginationOptions = mockPaginationOptions;
    fixture.detectChanges();
    objectSelectService = (comp as any).objectSelectService;
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

    it('should switch the value through object-select-service', () => {
      spyOn((comp as any).objectSelectService, 'switch').and.callThrough();
      checkbox.click();
      expect((comp as any).objectSelectService.switch).toHaveBeenCalled();
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

  describe('when cancel is clicked', () => {
    let cancelButton: HTMLButtonElement;

    beforeEach(() => {
      cancelButton = fixture.debugElement.query(By.css('button.item-cancel')).nativeElement;
      spyOn(comp.cancel, 'emit').and.callThrough();
    });

    it('should emit a cancel event',() => {
      cancelButton.click();
      expect(comp.cancel.emit).toHaveBeenCalled();
    });
  });
});

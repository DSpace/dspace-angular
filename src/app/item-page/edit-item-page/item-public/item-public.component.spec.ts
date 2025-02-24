import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
  Item,
  ItemDataService,
  NotificationsService,
  NotificationsServiceStub,
  RouterStub,
} from '@dspace/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemPublicComponent } from './item-public.component';

let comp: ItemPublicComponent;
let fixture: ComponentFixture<ItemPublicComponent>;

let mockItem;
let itemPageUrl;
let routerStub;
let mockItemDataService: ItemDataService;
let routeStub;
let notificationsServiceStub;

describe('ItemPublicComponent', () => {
  beforeEach(waitForAsync(() => {

    mockItem = Object.assign(new Item(), {
      id: 'fake-id',
      handle: 'fake/handle',
      lastModified: '2018',
      isWithdrawn: true,
    });

    itemPageUrl = `fake-url/${mockItem.id}`;
    routerStub = Object.assign(new RouterStub(), {
      url: `${itemPageUrl}/edit`,
    });

    mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
      setDiscoverable: createSuccessfulRemoteDataObject$(mockItem),
    });

    routeStub = {
      data: observableOf({
        dso: createSuccessfulRemoteDataObject(mockItem),
      }),
    };

    notificationsServiceStub = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, ItemPublicComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPublicComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a page with messages based on the \'public\' messageKey', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.public.header');
    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.public.description');
    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.public.confirm');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.public.cancel');
  });

  describe('performAction', () => {
    it('should call setDiscoverable function from the ItemDataService', () => {
      spyOn(comp, 'processRestResponse');
      comp.performAction();

      expect(mockItemDataService.setDiscoverable).toHaveBeenCalledWith(mockItem, true);
      expect(comp.processRestResponse).toHaveBeenCalled();
    });
  });
});

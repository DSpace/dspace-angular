import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Item } from '../../../core/shared/item.model';
import { RouterStub } from '../../../shared/testing/router-stub';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemDeleteComponent } from './item-delete.component';
import { getItemEditPath } from '../../item-page-routing.module';
import { RestResponse } from '../../../core/cache/response.models';
import { createSuccessfulRemoteDataObject } from '../../../shared/testing/utils';

let comp: ItemDeleteComponent;
let fixture: ComponentFixture<ItemDeleteComponent>;

let mockItem;
let itemPageUrl;
let routerStub;
let mockItemDataService: ItemDataService;
let routeStub;
let notificationsServiceStub;

describe('ItemDeleteComponent', () => {
  beforeEach(async(() => {

    mockItem = Object.assign(new Item(), {
      id: 'fake-id',
      handle: 'fake/handle',
      lastModified: '2018',
      isWithdrawn: true
    });

    itemPageUrl = `fake-url/${mockItem.id}`;
    routerStub = Object.assign(new RouterStub(), {
      url: `${itemPageUrl}/edit`
    });

    mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
      delete: observableOf(true)
    });

    routeStub = {
      data: observableOf({
        item: createSuccessfulRemoteDataObject(mockItem)
      })
    };

    notificationsServiceStub = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemDeleteComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDeleteComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a page with messages based on the \'delete\' messageKey', () => {
    const header = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.delete.header');
    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.delete.description');
    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.delete.confirm');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.delete.cancel');
  });

  describe('performAction', () => {
    it('should call delete function from the ItemDataService', () => {
      spyOn(comp, 'notify');
      comp.performAction();
      expect(mockItemDataService.delete).toHaveBeenCalledWith(mockItem);
      expect(comp.notify).toHaveBeenCalled();
    });
  });
  describe('notify', () => {
    it('should navigate to the homepage on successful deletion of the item', () => {
      comp.notify(true);
      expect(routerStub.navigate).toHaveBeenCalledWith(['']);
    });
  });
  describe('notify', () => {
    it('should navigate to the item edit page on failed deletion of the item', () => {
      comp.notify(false);
      expect(routerStub.navigate).toHaveBeenCalledWith([getItemEditPath('fake-id')]);
    });
  });
})
;

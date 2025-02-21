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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { IdentifierDataService } from '../../../../../modules/core/src/lib/core/data/identifier-data.service';
import { ItemDataService } from '../../../../../modules/core/src/lib/core/data/item-data.service';
import { NotificationsService } from '../../../../../modules/core/src/lib/core/notifications/notifications.service';
import { Item } from '../../../../../modules/core/src/lib/core/shared/item.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { NotificationsServiceStub } from '../../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { RouterStub } from '../../../../../modules/core/src/lib/core/utilities/testing/router.stub';
import { ItemRegisterDoiComponent } from './item-register-doi.component';

let comp: ItemRegisterDoiComponent;
let fixture: ComponentFixture<ItemRegisterDoiComponent>;

let mockItem;
let itemPageUrl;
let routerStub;
let mockItemDataService: ItemDataService;
let mockIdentifierDataService: IdentifierDataService;
let routeStub;
let notificationsServiceStub;

describe('ItemRegisterDoiComponent', () => {
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

    mockIdentifierDataService = jasmine.createSpyObj('mockIdentifierDataService', {
      getIdentifierDataFor: createSuccessfulRemoteDataObject$({ 'identifiers': [] }),
      getIdentifierRegistrationConfiguration: createSuccessfulRemoteDataObject$('true'),
      registerIdentifier: createSuccessfulRemoteDataObject$({ 'identifiers': [] }),
    });

    mockItemDataService = jasmine.createSpyObj('mockItemDataService', {
      registerDOI: createSuccessfulRemoteDataObject$(mockItem),
    });

    routeStub = {
      data: observableOf({
        dso: createSuccessfulRemoteDataObject(Object.assign(new Item(), {
          id: 'fake-id',
        })),
      }),
    };

    notificationsServiceStub = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, ItemRegisterDoiComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: IdentifierDataService, useValue: mockIdentifierDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRegisterDoiComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a page with messages based on the \'register-doi\' messageKey', () => {
    const header = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.register-doi.header');
    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.register-doi.description');
    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.register-doi.confirm');
    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.register-doi.cancel');
  });

  describe('performAction', () => {
    it('should call registerDOI function from the ItemDataService', () => {
      spyOn(comp, 'processRestResponse');
      comp.performAction();
      expect(mockIdentifierDataService.registerIdentifier).toHaveBeenCalledWith(comp.item, 'doi');
      expect(comp.processRestResponse).toHaveBeenCalled();
    });
  });
});

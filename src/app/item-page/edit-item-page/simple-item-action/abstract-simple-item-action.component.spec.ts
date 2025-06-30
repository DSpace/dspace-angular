import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
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
import { of } from 'rxjs';

import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { getItemEditRoute } from '../../item-page-routing-paths';
import { AbstractSimpleItemActionComponent } from './abstract-simple-item-action.component';

/**
 * Test component that implements the AbstractSimpleItemActionComponent used to test the
 * AbstractSimpleItemActionComponent component
 */
@Component({
  selector: 'ds-simple-action',
  templateUrl: './abstract-simple-item-action.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
  ],
})
export class MySimpleItemActionComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'myEditAction';
  protected predicate = (rd: RemoteData<Item>) => rd.payload.isWithdrawn;

  performAction() {
    // do nothing
  }

}

let comp: MySimpleItemActionComponent;
let fixture: ComponentFixture<MySimpleItemActionComponent>;

let mockItem;
let itemPageUrl;
let routerStub;
let mockItemDataService;
let routeStub;
let notificationsServiceStub;
let successfulRemoteData;
let failedRemoteData;

describe('AbstractSimpleItemActionComponent', () => {
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

    mockItemDataService = jasmine.createSpyObj({
      findById: createSuccessfulRemoteDataObject$(mockItem),
    });

    routeStub = {
      data: of({
        dso: createSuccessfulRemoteDataObject(Object.assign(new Item(), {
          id: 'fake-id',
        })),
      }),
    };

    notificationsServiceStub = new NotificationsServiceStub();

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, MySimpleItemActionComponent],
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
    successfulRemoteData = createSuccessfulRemoteDataObject({ });
    failedRemoteData = createFailedRemoteDataObject('Internal Server Error', 500);

    fixture = TestBed.createComponent(MySimpleItemActionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('should render a page with messages based on the provided messageKey', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.innerHTML).toContain('item.edit.myEditAction.header');

    const description = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(description.innerHTML).toContain('item.edit.myEditAction.description');

    const confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
    expect(confirmButton.innerHTML).toContain('item.edit.myEditAction.confirm');

    const cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
    expect(cancelButton.innerHTML).toContain('item.edit.myEditAction.cancel');
  });

  it('should perform action when the button is clicked', () => {
    spyOn(comp, 'performAction');
    const performButton = fixture.debugElement.query(By.css('.perform-action'));
    performButton.triggerEventHandler('click', null);

    expect(comp.performAction).toHaveBeenCalled();
  });

  it('should process a RemoteData to navigate and display success notification', () => {
    comp.processRestResponse(successfulRemoteData);

    expect(notificationsServiceStub.success).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith([getItemEditRoute(mockItem)]);
  });

  it('should process a RemoteData to navigate and display success notification', () => {
    comp.processRestResponse(failedRemoteData);

    expect(notificationsServiceStub.error).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith([getItemEditRoute(mockItem)]);
  });

});

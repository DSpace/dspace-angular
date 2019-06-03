import * as tslib_1 from "tslib";
import { async, TestBed } from '@angular/core/testing';
import { Item } from '../../../core/shared/item.model';
import { RouterStub } from '../../../shared/testing/router-stub';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { AbstractSimpleItemActionComponent } from './abstract-simple-item-action.component';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { getItemEditPath } from '../../item-page-routing.module';
import { RestResponse } from '../../../core/cache/response.models';
/**
 * Test component that implements the AbstractSimpleItemActionComponent used to test the
 * AbstractSimpleItemActionComponent component
 */
var MySimpleItemActionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(MySimpleItemActionComponent, _super);
    function MySimpleItemActionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageKey = 'myEditAction';
        _this.predicate = function (rd) { return rd.payload.isWithdrawn; };
        return _this;
    }
    MySimpleItemActionComponent.prototype.performAction = function () {
        // do nothing
    };
    MySimpleItemActionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-simple-action',
            templateUrl: './abstract-simple-item-action.component.html'
        })
    ], MySimpleItemActionComponent);
    return MySimpleItemActionComponent;
}(AbstractSimpleItemActionComponent));
export { MySimpleItemActionComponent };
var comp;
var fixture;
var mockItem;
var itemPageUrl;
var routerStub;
var mockItemDataService;
var routeStub;
var notificationsServiceStub;
var successfulRestResponse;
var failRestResponse;
describe('AbstractSimpleItemActionComponent', function () {
    beforeEach(async(function () {
        mockItem = Object.assign(new Item(), {
            id: 'fake-id',
            handle: 'fake/handle',
            lastModified: '2018',
            isWithdrawn: true
        });
        itemPageUrl = "fake-url/" + mockItem.id;
        routerStub = Object.assign(new RouterStub(), {
            url: itemPageUrl + "/edit"
        });
        mockItemDataService = jasmine.createSpyObj({
            findById: observableOf(new RemoteData(false, false, true, undefined, mockItem))
        });
        routeStub = {
            data: observableOf({
                item: new RemoteData(false, false, true, null, {
                    id: 'fake-id'
                })
            })
        };
        notificationsServiceStub = new NotificationsServiceStub();
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
            declarations: [MySimpleItemActionComponent],
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
    beforeEach(function () {
        successfulRestResponse = new RestResponse(true, 200, 'OK');
        failRestResponse = new RestResponse(false, 500, 'Internal Server Error');
        fixture = TestBed.createComponent(MySimpleItemActionComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        fixture.destroy();
        comp = null;
    });
    it('should render a page with messages based on the provided messageKey', function () {
        var header = fixture.debugElement.query(By.css('h2')).nativeElement;
        expect(header.innerHTML).toContain('item.edit.myEditAction.header');
        var description = fixture.debugElement.query(By.css('p')).nativeElement;
        expect(description.innerHTML).toContain('item.edit.myEditAction.description');
        var confirmButton = fixture.debugElement.query(By.css('button.perform-action')).nativeElement;
        expect(confirmButton.innerHTML).toContain('item.edit.myEditAction.confirm');
        var cancelButton = fixture.debugElement.query(By.css('button.cancel')).nativeElement;
        expect(cancelButton.innerHTML).toContain('item.edit.myEditAction.cancel');
    });
    it('should perform action when the button is clicked', function () {
        spyOn(comp, 'performAction');
        var performButton = fixture.debugElement.query(By.css('.perform-action'));
        performButton.triggerEventHandler('click', null);
        expect(comp.performAction).toHaveBeenCalled();
    });
    it('should process a RestResponse to navigate and display success notification', function () {
        comp.processRestResponse(successfulRestResponse);
        expect(notificationsServiceStub.success).toHaveBeenCalled();
        expect(routerStub.navigate).toHaveBeenCalledWith([getItemEditPath(mockItem.id)]);
    });
    it('should process a RestResponse to navigate and display success notification', function () {
        comp.processRestResponse(failRestResponse);
        expect(notificationsServiceStub.error).toHaveBeenCalled();
        expect(routerStub.navigate).toHaveBeenCalledWith([getItemEditPath(mockItem.id)]);
    });
});
//# sourceMappingURL=abstract-simple-item-action.component.spec.js.map
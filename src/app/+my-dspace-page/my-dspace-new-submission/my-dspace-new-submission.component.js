import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { NotificationType } from '../../shared/notifications/models/notification-type';
import { hasValue } from '../../shared/empty.util';
/**
 * This component represents the whole mydspace page header
 */
var MyDSpaceNewSubmissionComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {AuthService} authService
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {HALEndpointService} halService
     * @param {NotificationsService} notificationsService
     * @param {Store<SubmissionState>} store
     * @param {TranslateService} translate
     */
    function MyDSpaceNewSubmissionComponent(authService, changeDetectorRef, halService, notificationsService, store, translate) {
        this.authService = authService;
        this.changeDetectorRef = changeDetectorRef;
        this.halService = halService;
        this.notificationsService = notificationsService;
        this.store = store;
        this.translate = translate;
        this.uploadEnd = new EventEmitter();
        /**
         * The UploaderOptions object
         */
        this.uploadFilesOptions = {
            url: '',
            authToken: null,
            disableMultipart: false,
            itemAlias: null
        };
    }
    /**
     * Initialize url and Bearer token
     */
    MyDSpaceNewSubmissionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.halService.getEndpoint('workspaceitems').pipe(first()).subscribe(function (url) {
            _this.uploadFilesOptions.url = url;
            _this.uploadFilesOptions.authToken = _this.authService.buildAuthHeader();
            _this.changeDetectorRef.detectChanges();
        });
    };
    /**
     * Method called when file upload is completed to notify upload status
     */
    MyDSpaceNewSubmissionComponent.prototype.onCompleteItem = function (res) {
        if (res && res._embedded && res._embedded.workspaceitems && res._embedded.workspaceitems.length > 0) {
            var workspaceitems = res._embedded.workspaceitems;
            this.uploadEnd.emit(workspaceitems);
            if (workspaceitems.length === 1) {
                var options = new NotificationOptions();
                options.timeOut = 0;
                var link = '/workspaceitems/' + workspaceitems[0].id + '/edit';
                this.notificationsService.notificationWithAnchor(NotificationType.Success, options, link, 'mydspace.general.text-here', 'mydspace.upload.upload-successful', 'here');
            }
            else if (workspaceitems.length > 1) {
                this.notificationsService.success(null, this.translate.get('mydspace.upload.upload-multiple-successful', { qty: workspaceitems.length }));
            }
        }
        else {
            this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
        }
    };
    /**
     * Method called on file upload error
     */
    MyDSpaceNewSubmissionComponent.prototype.onUploadError = function () {
        this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
    };
    /**
     * Unsubscribe from the subscription
     */
    MyDSpaceNewSubmissionComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], MyDSpaceNewSubmissionComponent.prototype, "uploadEnd", void 0);
    MyDSpaceNewSubmissionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-my-dspace-new-submission',
            styleUrls: ['./my-dspace-new-submission.component.scss'],
            templateUrl: './my-dspace-new-submission.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService,
            ChangeDetectorRef,
            HALEndpointService,
            NotificationsService,
            Store,
            TranslateService])
    ], MyDSpaceNewSubmissionComponent);
    return MyDSpaceNewSubmissionComponent;
}());
export { MyDSpaceNewSubmissionComponent };
//# sourceMappingURL=my-dspace-new-submission.component.js.map
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, find, flatMap, map, reduce, take, tap } from 'rxjs/operators';
import { SectionModelComponent } from '../models/section.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';
import { SubmissionUploadsConfigService } from '../../../core/config/submission-uploads-config.service';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { AlertType } from '../../../shared/alert/aletr-type';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
export var POLICY_DEFAULT_NO_LIST = 1; // Banner1
export var POLICY_DEFAULT_WITH_LIST = 2; // Banner2
/**
 * This component represents a section that contains submission's bitstreams
 */
var SubmissionSectionUploadComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionSectionUploadComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {SectionUploadService} bitstreamService
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {CollectionDataService} collectionDataService
     * @param {GroupEpersonService} groupService
     * @param {SectionsService} sectionService
     * @param {SubmissionService} submissionService
     * @param {SubmissionUploadsConfigService} uploadsConfigService
     * @param {SectionDataObject} injectedSectionData
     * @param {string} injectedSubmissionId
     */
    function SubmissionSectionUploadComponent(bitstreamService, changeDetectorRef, collectionDataService, groupService, sectionService, submissionService, uploadsConfigService, injectedSectionData, injectedSubmissionId) {
        var _this = _super.call(this, undefined, injectedSectionData, injectedSubmissionId) || this;
        _this.bitstreamService = bitstreamService;
        _this.changeDetectorRef = changeDetectorRef;
        _this.collectionDataService = collectionDataService;
        _this.groupService = groupService;
        _this.sectionService = sectionService;
        _this.submissionService = submissionService;
        _this.uploadsConfigService = uploadsConfigService;
        _this.injectedSectionData = injectedSectionData;
        _this.injectedSubmissionId = injectedSubmissionId;
        /**
         * The AlertType enumeration
         * @type {AlertType}
         */
        _this.AlertTypeEnum = AlertType;
        /**
         * The array containing the keys of file list array
         * @type {Array}
         */
        _this.fileIndexes = [];
        /**
         * The file list
         * @type {Array}
         */
        _this.fileList = [];
        /**
         * The array containing the name of the files
         * @type {Array}
         */
        _this.fileNames = [];
        /**
         * Default access conditions of this collection
         * @type {Array}
         */
        _this.collectionDefaultAccessConditions = [];
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        _this.subs = [];
        return _this;
    }
    /**
     * Initialize all instance variables and retrieve collection default access conditions
     */
    SubmissionSectionUploadComponent.prototype.onSectionInit = function () {
        var _this = this;
        var config$ = this.uploadsConfigService.getConfigByHref(this.sectionData.config).pipe(map(function (config) { return config.payload; }));
        // retrieve configuration for the bitstream's metadata form
        this.configMetadataForm$ = config$.pipe(take(1), map(function (config) { return config.metadata; }));
        this.subs.push(this.submissionService.getSubmissionObject(this.submissionId).pipe(filter(function (submissionObject) { return isNotUndefined(submissionObject) && !submissionObject.isLoading; }), filter(function (submissionObject) { return isUndefined(_this.collectionId) || _this.collectionId !== submissionObject.collection; }), tap(function (submissionObject) { return _this.collectionId = submissionObject.collection; }), flatMap(function (submissionObject) { return _this.collectionDataService.findById(submissionObject.collection); }), find(function (rd) { return isNotUndefined((rd.payload)); }), tap(function (collectionRemoteData) { return _this.collectionName = collectionRemoteData.payload.name; }), flatMap(function (collectionRemoteData) {
            return _this.collectionDataService.findByHref(collectionRemoteData.payload._links.defaultAccessConditions);
        }), find(function (defaultAccessConditionsRemoteData) {
            return defaultAccessConditionsRemoteData.hasSucceeded;
        }), tap(function (defaultAccessConditionsRemoteData) {
            if (isNotEmpty(defaultAccessConditionsRemoteData.payload)) {
                _this.collectionDefaultAccessConditions = Array.isArray(defaultAccessConditionsRemoteData.payload)
                    ? defaultAccessConditionsRemoteData.payload : [defaultAccessConditionsRemoteData.payload];
            }
        }), flatMap(function () { return config$; }), take(1), flatMap(function (config) {
            _this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];
            _this.collectionPolicyType = _this.availableAccessConditionOptions.length > 0
                ? POLICY_DEFAULT_WITH_LIST
                : POLICY_DEFAULT_NO_LIST;
            _this.availableGroups = new Map();
            var mapGroups$ = [];
            // Retrieve Groups for accessCondition Policies
            _this.availableAccessConditionOptions.forEach(function (accessCondition) {
                if (accessCondition.hasEndDate === true || accessCondition.hasStartDate === true) {
                    if (accessCondition.groupUUID) {
                        mapGroups$.push(_this.groupService.findById(accessCondition.groupUUID).pipe(find(function (rd) { return !rd.isResponsePending && rd.hasSucceeded; }), map(function (rd) { return ({
                            accessCondition: accessCondition.name,
                            groups: [rd.payload]
                        }); })));
                    }
                    else if (accessCondition.selectGroupUUID) {
                        mapGroups$.push(_this.groupService.findById(accessCondition.selectGroupUUID).pipe(find(function (rd) { return !rd.isResponsePending && rd.hasSucceeded; }), flatMap(function (group) { return group.payload.groups; }), find(function (rd) { return !rd.isResponsePending && rd.hasSucceeded; }), map(function (rd) { return ({
                            accessCondition: accessCondition.name,
                            groups: rd.payload.page
                        }); })));
                    }
                }
            });
            return mapGroups$;
        }), flatMap(function (entry) { return entry; }), reduce(function (acc, entry) {
            acc.push(entry);
            return acc;
        }, [])).subscribe(function (entries) {
            entries.forEach(function (entry) {
                _this.availableGroups.set(entry.accessCondition, entry.groups);
            });
            _this.changeDetectorRef.detectChanges();
        }), 
        // retrieve submission's bitstreams from state
        combineLatest(this.configMetadataForm$, this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id)).pipe(filter(function (_a) {
            var configMetadataForm = _a[0], fileList = _a[1];
            return isNotEmpty(configMetadataForm) && isNotUndefined(fileList);
        }), distinctUntilChanged())
            .subscribe(function (_a) {
            var configMetadataForm = _a[0], fileList = _a[1];
            _this.fileList = [];
            _this.fileIndexes = [];
            _this.fileNames = [];
            _this.changeDetectorRef.detectChanges();
            if (isNotUndefined(fileList) && fileList.length > 0) {
                fileList.forEach(function (file) {
                    _this.fileList.push(file);
                    _this.fileIndexes.push(file.uuid);
                    _this.fileNames.push(_this.getFileName(configMetadataForm, file));
                });
            }
            _this.changeDetectorRef.detectChanges();
        }));
    };
    /**
     * Return file name from metadata
     *
     * @param configMetadataForm
     *    the bitstream's form configuration
     * @param fileData
     *    the file metadata
     */
    SubmissionSectionUploadComponent.prototype.getFileName = function (configMetadataForm, fileData) {
        var metadataName = configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
        var title;
        if (isNotEmpty(fileData.metadata) && isNotEmpty(fileData.metadata[metadataName])) {
            title = fileData.metadata[metadataName][0].display;
        }
        else {
            title = fileData.uuid;
        }
        return title;
    };
    /**
     * Get section status
     *
     * @return Observable<boolean>
     *     the section status
     */
    SubmissionSectionUploadComponent.prototype.getSectionStatus = function () {
        return this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id).pipe(map(function (fileList) { return (isNotUndefined(fileList) && fileList.length > 0); }));
    };
    /**
     * Method provided by Angular. Invoked when the instance is destroyed.
     */
    SubmissionSectionUploadComponent.prototype.onSectionDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    SubmissionSectionUploadComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-upload',
            styleUrls: ['./section-upload.component.scss'],
            templateUrl: './section-upload.component.html',
        }),
        renderSectionFor(SectionsType.Upload),
        tslib_1.__param(7, Inject('sectionDataProvider')),
        tslib_1.__param(8, Inject('submissionIdProvider')),
        tslib_1.__metadata("design:paramtypes", [SectionUploadService,
            ChangeDetectorRef,
            CollectionDataService,
            GroupEpersonService,
            SectionsService,
            SubmissionService,
            SubmissionUploadsConfigService, Object, String])
    ], SubmissionSectionUploadComponent);
    return SubmissionSectionUploadComponent;
}(SectionModelComponent));
export { SubmissionSectionUploadComponent };
//# sourceMappingURL=section-upload.component.js.map
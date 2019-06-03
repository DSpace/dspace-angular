import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, find, flatMap, map, mergeMap, reduce, startWith } from 'rxjs/operators';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionService } from '../../submission.service';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
/**
 * This component allows to show the current collection the submission belonging to and to change it.
 */
var SubmissionFormCollectionComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} cdr
     * @param {CommunityDataService} communityDataService
     * @param {JsonPatchOperationsBuilder} operationsBuilder
     * @param {SubmissionJsonPatchOperationsService} operationsService
     * @param {SubmissionService} submissionService
     */
    function SubmissionFormCollectionComponent(cdr, communityDataService, operationsBuilder, operationsService, submissionService) {
        this.cdr = cdr;
        this.communityDataService = communityDataService;
        this.operationsBuilder = operationsBuilder;
        this.operationsService = operationsService;
        this.submissionService = submissionService;
        /**
         * An event fired when a different collection is selected.
         * Event's payload equals to new SubmissionObject.
         */
        this.collectionChange = new EventEmitter();
        /**
         * A boolean representing if this dropdown button is disabled
         * @type {BehaviorSubject<boolean>}
         */
        this.disabled$ = new BehaviorSubject(true);
        /**
         * The search form control
         * @type {FormControl}
         */
        this.searchField = new FormControl();
        /**
         * A boolean representing if dropdown list is scrollable to the bottom
         * @type {boolean}
         */
        this.scrollableBottom = false;
        /**
         * A boolean representing if dropdown list is scrollable to the top
         * @type {boolean}
         */
        this.scrollableTop = false;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        this.subs = [];
    }
    /**
     * Method called on mousewheel event, it prevent the page scroll
     * when arriving at the top/bottom of dropdown menu
     *
     * @param event
     *     mousewheel event
     */
    SubmissionFormCollectionComponent.prototype.onMousewheel = function (event) {
        if (event.wheelDelta > 0 && this.scrollableTop) {
            event.preventDefault();
        }
        if (event.wheelDelta < 0 && this.scrollableBottom) {
            event.preventDefault();
        }
    };
    /**
     * Check if dropdown scrollbar is at the top or bottom of the dropdown list
     *
     * @param event
     */
    SubmissionFormCollectionComponent.prototype.onScroll = function (event) {
        this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
        this.scrollableTop = (event.target.scrollTop === 0);
    };
    /**
     * Initialize collection list
     */
    SubmissionFormCollectionComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (hasValue(changes.currentCollectionId)
            && hasValue(changes.currentCollectionId.currentValue)) {
            this.selectedCollectionId = this.currentCollectionId;
            // @TODO replace with search/top browse endpoint
            // @TODO implement community/subcommunity hierarchy
            var communities$ = this.communityDataService.findAll().pipe(find(function (communities) { return isNotEmpty(communities.payload); }), mergeMap(function (communities) { return communities.payload.page; }));
            var listCollection$ = communities$.pipe(flatMap(function (communityData) {
                return communityData.collections.pipe(find(function (collections) { return !collections.isResponsePending && collections.hasSucceeded; }), mergeMap(function (collections) { return collections.payload.page; }), filter(function (collectionData) { return isNotEmpty(collectionData); }), map(function (collectionData) { return ({
                    communities: [{ id: communityData.id, name: communityData.name }],
                    collection: { id: collectionData.id, name: collectionData.name }
                }); }));
            }), reduce(function (acc, value) { return acc.concat(value); }, []), startWith([]));
            this.selectedCollectionName$ = communities$.pipe(flatMap(function (communityData) {
                return communityData.collections.pipe(find(function (collections) { return !collections.isResponsePending && collections.hasSucceeded; }), mergeMap(function (collections) { return collections.payload.page; }), filter(function (collectionData) { return isNotEmpty(collectionData); }), filter(function (collectionData) { return collectionData.id === _this.selectedCollectionId; }), map(function (collectionData) { return collectionData.name; }));
            }), startWith(''));
            var searchTerm$ = this.searchField.valueChanges.pipe(debounceTime(200), distinctUntilChanged(), startWith(''));
            this.searchListCollection$ = combineLatest(searchTerm$, listCollection$).pipe(map(function (_a) {
                var searchTerm = _a[0], listCollection = _a[1];
                _this.disabled$.next(isEmpty(listCollection));
                if (isEmpty(searchTerm)) {
                    return listCollection;
                }
                else {
                    return listCollection.filter(function (v) { return v.collection.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1; }).slice(0, 5);
                }
            }));
        }
    };
    /**
     * Initialize all instance variables
     */
    SubmissionFormCollectionComponent.prototype.ngOnInit = function () {
        this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'collection');
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionFormCollectionComponent.prototype.ngOnDestroy = function () {
        this.subs.filter(function (sub) { return hasValue(sub); }).forEach(function (sub) { return sub.unsubscribe(); });
    };
    /**
     * Emit a [collectionChange] event when a new collection is selected from list
     *
     * @param event
     *    the selected [CollectionListEntryItem]
     */
    SubmissionFormCollectionComponent.prototype.onSelect = function (event) {
        var _this = this;
        this.searchField.reset();
        this.disabled$.next(true);
        this.operationsBuilder.replace(this.pathCombiner.getPath(), event.collection.id, true);
        this.subs.push(this.operationsService.jsonPatchByResourceID(this.submissionService.getSubmissionObjectLinkName(), this.submissionId, 'sections', 'collection')
            .subscribe(function (submissionObject) {
            _this.selectedCollectionId = event.collection.id;
            _this.selectedCollectionName$ = observableOf(event.collection.name);
            _this.collectionChange.emit(submissionObject[0]);
            _this.submissionService.changeSubmissionCollection(_this.submissionId, event.collection.id);
            _this.disabled$.next(false);
            _this.cdr.detectChanges();
        }));
    };
    /**
     * Reset search form control on dropdown menu close
     */
    SubmissionFormCollectionComponent.prototype.onClose = function () {
        this.searchField.reset();
    };
    /**
     * Reset search form control when dropdown menu is closed
     *
     * @param isOpen
     *    Representing if the dropdown menu is open or not.
     */
    SubmissionFormCollectionComponent.prototype.toggled = function (isOpen) {
        if (!isOpen) {
            this.searchField.reset();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormCollectionComponent.prototype, "currentCollectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionFormCollectionComponent.prototype, "currentDefinition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionFormCollectionComponent.prototype, "submissionId", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], SubmissionFormCollectionComponent.prototype, "collectionChange", void 0);
    tslib_1.__decorate([
        HostListener('mousewheel', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubmissionFormCollectionComponent.prototype, "onMousewheel", null);
    SubmissionFormCollectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-form-collection',
            styleUrls: ['./submission-form-collection.component.scss'],
            templateUrl: './submission-form-collection.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            CommunityDataService,
            JsonPatchOperationsBuilder,
            SubmissionJsonPatchOperationsService,
            SubmissionService])
    ], SubmissionFormCollectionComponent);
    return SubmissionFormCollectionComponent;
}());
export { SubmissionFormCollectionComponent };
//# sourceMappingURL=submission-form-collection.component.js.map
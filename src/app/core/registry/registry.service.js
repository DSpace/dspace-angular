import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaginatedList } from '../data/paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { MetadataField } from '../metadata/metadatafield.model';
import { CreateMetadataFieldRequest, CreateMetadataSchemaRequest, DeleteRequest, GetRequest, UpdateMetadataFieldRequest, UpdateMetadataSchemaRequest } from '../data/request.models';
import { RegistryMetadataschemasResponseParsingService } from '../data/registry-metadataschemas-response-parsing.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RegistryMetadatafieldsResponseParsingService } from '../data/registry-metadatafields-response-parsing.service';
import { hasValue, hasNoValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RegistryBitstreamformatsResponseParsingService } from '../data/registry-bitstreamformats-response-parsing.service';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { createSelector, select, Store } from '@ngrx/store';
import { MetadataRegistryCancelFieldAction, MetadataRegistryCancelSchemaAction, MetadataRegistryDeselectAllFieldAction, MetadataRegistryDeselectAllSchemaAction, MetadataRegistryDeselectFieldAction, MetadataRegistryDeselectSchemaAction, MetadataRegistryEditFieldAction, MetadataRegistryEditSchemaAction, MetadataRegistrySelectFieldAction, MetadataRegistrySelectSchemaAction } from '../../+admin/admin-registries/metadata-registry/metadata-registry.actions';
import { distinctUntilChanged, flatMap, map, take, tap } from 'rxjs/operators';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { ResourceType } from '../shared/resource-type';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
var metadataRegistryStateSelector = function (state) { return state.metadataRegistry; };
var editMetadataSchemaSelector = createSelector(metadataRegistryStateSelector, function (metadataState) { return metadataState.editSchema; });
var selectedMetadataSchemasSelector = createSelector(metadataRegistryStateSelector, function (metadataState) { return metadataState.selectedSchemas; });
var editMetadataFieldSelector = createSelector(metadataRegistryStateSelector, function (metadataState) { return metadataState.editField; });
var selectedMetadataFieldsSelector = createSelector(metadataRegistryStateSelector, function (metadataState) { return metadataState.selectedFields; });
var RegistryService = /** @class */ (function () {
    function RegistryService(requestService, rdb, halService, store, notificationsService, translateService) {
        this.requestService = requestService;
        this.rdb = rdb;
        this.halService = halService;
        this.store = store;
        this.notificationsService = notificationsService;
        this.translateService = translateService;
        this.metadataSchemasPath = 'metadataschemas';
        this.metadataFieldsPath = 'metadatafields';
        this.bitstreamFormatsPath = 'bitstreamformats';
    }
    RegistryService.prototype.getMetadataSchemas = function (pagination) {
        var _this = this;
        var requestObs = this.getMetadataSchemasRequestObs(pagination);
        var requestEntryObs = requestObs.pipe(flatMap(function (request) { return _this.requestService.getByHref(request.href); }));
        var rmrObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.metadataschemasResponse; }));
        var metadataschemasObs = rmrObs.pipe(map(function (rmr) { return rmr.metadataschemas; }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(metadataschemasObs, pageInfoObs).pipe(map(function (_a) {
            var metadataschemas = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, metadataschemas);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    RegistryService.prototype.getMetadataSchemaByName = function (schemaName) {
        var _this = this;
        // Temporary pagination to get ALL metadataschemas until there's a rest api endpoint for fetching a specific schema
        var pagination = Object.assign(new PaginationComponentOptions(), {
            id: 'all-metadatafields-pagination',
            pageSize: 10000
        });
        var requestObs = this.getMetadataSchemasRequestObs(pagination);
        var requestEntryObs = requestObs.pipe(flatMap(function (request) { return _this.requestService.getByHref(request.href); }));
        var rmrObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.metadataschemasResponse; }));
        var metadataschemaObs = rmrObs.pipe(map(function (rmr) { return rmr.metadataschemas; }), map(function (metadataSchemas) { return metadataSchemas.filter(function (value) { return value.prefix === schemaName; })[0]; }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, metadataschemaObs);
    };
    RegistryService.prototype.getMetadataFieldsBySchema = function (schema, pagination) {
        var _this = this;
        var requestObs = this.getMetadataFieldsBySchemaRequestObs(pagination, schema);
        var requestEntryObs = requestObs.pipe(flatMap(function (request) { return _this.requestService.getByHref(request.href); }));
        var rmrObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.metadatafieldsResponse; }));
        var metadatafieldsObs = rmrObs.pipe(map(function (rmr) { return rmr.metadatafields; }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(metadatafieldsObs, pageInfoObs).pipe(map(function (_a) {
            var metadatafields = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, metadatafields);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    /**
     * Retrieve all existing metadata fields as a paginated list
     * @param pagination Pagination options to determine which page of metadata fields should be requested
     * When no pagination is provided, all metadata fields are requested in one large page
     * @returns an observable that emits a remote data object with a page of metadata fields
     */
    RegistryService.prototype.getAllMetadataFields = function (pagination) {
        var _this = this;
        if (hasNoValue(pagination)) {
            pagination = { currentPage: 1, pageSize: 10000 };
        }
        var requestObs = this.getMetadataFieldsRequestObs(pagination);
        var requestEntryObs = requestObs.pipe(flatMap(function (request) { return _this.requestService.getByHref(request.href); }));
        var rmrObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.metadatafieldsResponse; }));
        var metadatafieldsObs = rmrObs.pipe(map(function (rmr) { return rmr.metadatafields; }), 
        /* Make sure to explicitly cast this into a MetadataField object, on first page loads this object comes from the object cache created by the server and its prototype is unknown */
        map(function (metadataFields) { return metadataFields.map(function (metadataField) { return Object.assign(new MetadataField(), metadataField); }); }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(metadatafieldsObs, pageInfoObs).pipe(map(function (_a) {
            var metadatafields = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, metadatafields);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    RegistryService.prototype.getBitstreamFormats = function (pagination) {
        var _this = this;
        var requestObs = this.getBitstreamFormatsRequestObs(pagination);
        var requestEntryObs = requestObs.pipe(flatMap(function (request) { return _this.requestService.getByHref(request.href); }));
        var rbrObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.bitstreamformatsResponse; }));
        var bitstreamformatsObs = rbrObs.pipe(map(function (rbr) { return rbr.bitstreamformats; }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(bitstreamformatsObs, pageInfoObs).pipe(map(function (_a) {
            var bitstreamformats = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, bitstreamformats);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    RegistryService.prototype.getMetadataSchemasRequestObs = function (pagination) {
        var _this = this;
        return this.halService.getEndpoint(this.metadataSchemasPath).pipe(map(function (url) {
            var args = [];
            args.push("size=" + pagination.pageSize);
            args.push("page=" + (pagination.currentPage - 1));
            if (isNotEmpty(args)) {
                url = new URLCombiner(url, "?" + args.join('&')).toString();
            }
            var request = new GetRequest(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return RegistryMetadataschemasResponseParsingService;
                }
            });
        }), tap(function (request) { return _this.requestService.configure(request); }));
    };
    RegistryService.prototype.getMetadataFieldsBySchemaRequestObs = function (pagination, schema) {
        var _this = this;
        return this.halService.getEndpoint(this.metadataFieldsPath + '/search/bySchema').pipe(
        // return this.halService.getEndpoint(this.metadataFieldsPath).pipe(
        map(function (url) {
            var args = [];
            args.push("schema=" + schema.prefix);
            args.push("size=" + pagination.pageSize);
            args.push("page=" + (pagination.currentPage - 1));
            if (isNotEmpty(args)) {
                url = new URLCombiner(url, "?" + args.join('&')).toString();
            }
            var request = new GetRequest(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return RegistryMetadatafieldsResponseParsingService;
                }
            });
        }), tap(function (request) { return _this.requestService.configure(request); }));
    };
    RegistryService.prototype.getMetadataFieldsRequestObs = function (pagination) {
        var _this = this;
        return this.halService.getEndpoint(this.metadataFieldsPath).pipe(map(function (url) {
            var args = [];
            args.push("size=" + pagination.pageSize);
            args.push("page=" + (pagination.currentPage - 1));
            if (isNotEmpty(args)) {
                url = new URLCombiner(url, "?" + args.join('&')).toString();
            }
            var request = new GetRequest(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return RegistryMetadatafieldsResponseParsingService;
                }
            });
        }), tap(function (request) { return _this.requestService.configure(request); }));
    };
    RegistryService.prototype.getBitstreamFormatsRequestObs = function (pagination) {
        var _this = this;
        return this.halService.getEndpoint(this.bitstreamFormatsPath).pipe(map(function (url) {
            var args = [];
            args.push("size=" + pagination.pageSize);
            args.push("page=" + (pagination.currentPage - 1));
            if (isNotEmpty(args)) {
                url = new URLCombiner(url, "?" + args.join('&')).toString();
            }
            var request = new GetRequest(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return RegistryBitstreamformatsResponseParsingService;
                }
            });
        }), tap(function (request) { return _this.requestService.configure(request); }));
    };
    RegistryService.prototype.editMetadataSchema = function (schema) {
        this.store.dispatch(new MetadataRegistryEditSchemaAction(schema));
    };
    RegistryService.prototype.cancelEditMetadataSchema = function () {
        this.store.dispatch(new MetadataRegistryCancelSchemaAction());
    };
    RegistryService.prototype.getActiveMetadataSchema = function () {
        return this.store.pipe(select(editMetadataSchemaSelector));
    };
    RegistryService.prototype.selectMetadataSchema = function (schema) {
        this.store.dispatch(new MetadataRegistrySelectSchemaAction(schema));
    };
    RegistryService.prototype.deselectMetadataSchema = function (schema) {
        this.store.dispatch(new MetadataRegistryDeselectSchemaAction(schema));
    };
    RegistryService.prototype.deselectAllMetadataSchema = function () {
        this.store.dispatch(new MetadataRegistryDeselectAllSchemaAction());
    };
    RegistryService.prototype.getSelectedMetadataSchemas = function () {
        return this.store.pipe(select(selectedMetadataSchemasSelector));
    };
    RegistryService.prototype.editMetadataField = function (field) {
        this.store.dispatch(new MetadataRegistryEditFieldAction(field));
    };
    RegistryService.prototype.cancelEditMetadataField = function () {
        this.store.dispatch(new MetadataRegistryCancelFieldAction());
    };
    RegistryService.prototype.getActiveMetadataField = function () {
        return this.store.pipe(select(editMetadataFieldSelector));
    };
    RegistryService.prototype.selectMetadataField = function (field) {
        this.store.dispatch(new MetadataRegistrySelectFieldAction(field));
    };
    RegistryService.prototype.deselectMetadataField = function (field) {
        this.store.dispatch(new MetadataRegistryDeselectFieldAction(field));
    };
    RegistryService.prototype.deselectAllMetadataField = function () {
        this.store.dispatch(new MetadataRegistryDeselectAllFieldAction());
    };
    RegistryService.prototype.getSelectedMetadataFields = function () {
        return this.store.pipe(select(selectedMetadataFieldsSelector));
    };
    /**
     * Create or Update a MetadataSchema
     *  If the MetadataSchema contains an id, it is assumed the schema already exists and is updated instead
     *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
     *  - On creation, a CreateMetadataSchemaRequest is used
     *  - On update, a UpdateMetadataSchemaRequest is used
     * @param schema    The MetadataSchema to create or update
     */
    RegistryService.prototype.createOrUpdateMetadataSchema = function (schema) {
        var _this = this;
        var isUpdate = hasValue(schema.id);
        var requestId = this.requestService.generateRequestId();
        var endpoint$ = this.halService.getEndpoint(this.metadataSchemasPath).pipe(isNotEmptyOperator(), map(function (endpoint) { return (isUpdate ? endpoint + "/" + schema.id : endpoint); }), distinctUntilChanged());
        var serializedSchema = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(ResourceType.MetadataSchema)).serialize(schema);
        var request$ = endpoint$.pipe(take(1), map(function (endpoint) {
            if (isUpdate) {
                var options = Object.create({});
                var headers = new HttpHeaders();
                headers = headers.append('Content-Type', 'application/json');
                options.headers = headers;
                return new UpdateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema), options);
            }
            else {
                return new CreateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema));
            }
        }));
        // Execute the post/put request
        request$.pipe(configureRequest(this.requestService)).subscribe();
        // Return created/updated schema
        return this.requestService.getByUUID(requestId).pipe(getResponseFromEntry(), map(function (response) {
            if (!response.isSuccessful) {
                if (hasValue(response.errorMessage)) {
                    _this.notificationsService.error('Server Error:', response.errorMessage, new NotificationOptions(-1));
                }
            }
            else {
                _this.showNotifications(true, isUpdate, false, { prefix: schema.prefix });
                return response;
            }
        }), isNotEmptyOperator(), map(function (response) {
            if (isNotEmpty(response.metadataschema)) {
                return response.metadataschema;
            }
        }));
    };
    RegistryService.prototype.deleteMetadataSchema = function (id) {
        return this.delete(this.metadataSchemasPath, id);
    };
    RegistryService.prototype.clearMetadataSchemaRequests = function () {
        var _this = this;
        return this.halService.getEndpoint(this.metadataSchemasPath).pipe(tap(function (href) { return _this.requestService.removeByHrefSubstring(href); }));
    };
    /**
     * Create or Update a MetadataField
     *  If the MetadataField contains an id, it is assumed the field already exists and is updated instead
     *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
     *  - On creation, a CreateMetadataFieldRequest is used
     *  - On update, a UpdateMetadataFieldRequest is used
     * @param field    The MetadataField to create or update
     */
    RegistryService.prototype.createOrUpdateMetadataField = function (field) {
        var _this = this;
        var isUpdate = hasValue(field.id);
        var requestId = this.requestService.generateRequestId();
        var endpoint$ = this.halService.getEndpoint(this.metadataFieldsPath).pipe(isNotEmptyOperator(), map(function (endpoint) { return (isUpdate ? endpoint + "/" + field.id : endpoint + "?schemaId=" + field.schema.id); }), distinctUntilChanged());
        var request$ = endpoint$.pipe(take(1), map(function (endpoint) {
            if (isUpdate) {
                var options = Object.create({});
                var headers = new HttpHeaders();
                headers = headers.append('Content-Type', 'application/json');
                options.headers = headers;
                return new UpdateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field), options);
            }
            else {
                return new CreateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field));
            }
        }));
        // Execute the post/put request
        request$.pipe(configureRequest(this.requestService)).subscribe();
        // Return created/updated field
        return this.requestService.getByUUID(requestId).pipe(getResponseFromEntry(), map(function (response) {
            if (!response.isSuccessful) {
                if (hasValue(response.errorMessage)) {
                    _this.notificationsService.error('Server Error:', response.errorMessage, new NotificationOptions(-1));
                }
            }
            else {
                var fieldString = field.schema.prefix + "." + field.element + (field.qualifier ? "." + field.qualifier : '');
                _this.showNotifications(true, isUpdate, true, { field: fieldString });
                return response;
            }
        }), isNotEmptyOperator(), map(function (response) {
            if (isNotEmpty(response.metadatafield)) {
                return response.metadatafield;
            }
        }));
    };
    RegistryService.prototype.deleteMetadataField = function (id) {
        return this.delete(this.metadataFieldsPath, id);
    };
    RegistryService.prototype.clearMetadataFieldRequests = function () {
        var _this = this;
        return this.halService.getEndpoint(this.metadataFieldsPath).pipe(tap(function (href) { return _this.requestService.removeByHrefSubstring(href); }));
    };
    RegistryService.prototype.delete = function (path, id) {
        var requestId = this.requestService.generateRequestId();
        var endpoint$ = this.halService.getEndpoint(path).pipe(isNotEmptyOperator(), map(function (endpoint) { return endpoint + "/" + id; }), distinctUntilChanged());
        var request$ = endpoint$.pipe(take(1), map(function (endpoint) { return new DeleteRequest(requestId, endpoint); }));
        // Execute the delete request
        request$.pipe(configureRequest(this.requestService)).subscribe();
        return this.requestService.getByUUID(requestId).pipe(getResponseFromEntry());
    };
    RegistryService.prototype.showNotifications = function (success, edited, isField, options) {
        var _this = this;
        var prefix = 'admin.registries.schema.notification';
        var suffix = success ? 'success' : 'failure';
        var editedString = edited ? 'edited' : 'created';
        var messages = observableCombineLatest(this.translateService.get(success ? prefix + "." + suffix : prefix + "." + suffix), this.translateService.get("" + prefix + (isField ? '.field' : '') + "." + editedString, options));
        messages.subscribe(function (_a) {
            var head = _a[0], content = _a[1];
            if (success) {
                _this.notificationsService.success(head, content);
            }
            else {
                _this.notificationsService.error(head, content);
            }
        });
    };
    /**
     * Retrieve a filtered paginated list of metadata fields
     * @param query {string} The query to filter the field names by
     * @returns an observable that emits a remote data object with a page of metadata fields that match the query
     */
    RegistryService.prototype.queryMetadataFields = function (query) {
        return this.getAllMetadataFields().pipe(map(function (rd) {
            var filteredFields = rd.payload.page.filter(function (field) { return field.toString().indexOf(query) >= 0; });
            var page = new PaginatedList(new PageInfo(), filteredFields);
            return Object.assign({}, rd, { payload: page });
        }));
    };
    RegistryService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            HALEndpointService,
            Store,
            NotificationsService,
            TranslateService])
    ], RegistryService);
    return RegistryService;
}());
export { RegistryService };
//# sourceMappingURL=registry.service.js.map
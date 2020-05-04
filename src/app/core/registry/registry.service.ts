import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { PageInfo } from '../shared/page-info.model';
import {
  CreateMetadataFieldRequest,
  CreateMetadataSchemaRequest,
  DeleteRequest,
  GetRequest,
  RestRequest,
  UpdateMetadataFieldRequest,
  UpdateMetadataSchemaRequest
} from '../data/request.models';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from '../data/parsing.service';
import { RegistryMetadataschemasResponseParsingService } from '../data/registry-metadataschemas-response-parsing.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { RegistryMetadataschemasResponse } from './registry-metadataschemas-response.model';
import {
  MetadatafieldSuccessResponse,
  MetadataschemaSuccessResponse,
  RegistryMetadatafieldsSuccessResponse,
  RegistryMetadataschemasSuccessResponse,
  RestResponse
} from '../cache/response.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RegistryMetadatafieldsResponseParsingService } from '../data/registry-metadatafields-response-parsing.service';
import { RegistryMetadatafieldsResponse } from './registry-metadatafields-response.model';
import { hasNoValue, hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { createSelector, select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { MetadataRegistryState } from '../../+admin/admin-registries/metadata-registry/metadata-registry.reducers';
import {
  MetadataRegistryCancelFieldAction,
  MetadataRegistryCancelSchemaAction,
  MetadataRegistryDeselectAllFieldAction,
  MetadataRegistryDeselectAllSchemaAction,
  MetadataRegistryDeselectFieldAction,
  MetadataRegistryDeselectSchemaAction,
  MetadataRegistryEditFieldAction,
  MetadataRegistryEditSchemaAction,
  MetadataRegistrySelectFieldAction,
  MetadataRegistrySelectSchemaAction
} from '../../+admin/admin-registries/metadata-registry/metadata-registry.actions';
import { distinctUntilChanged, flatMap, map, take, tap } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { MetadataField } from '../metadata/metadata-field.model';
import { getClassForType } from '../cache/builders/build-decorators';

const metadataRegistryStateSelector = (state: AppState) => state.metadataRegistry;
const editMetadataSchemaSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.editSchema);
const selectedMetadataSchemasSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.selectedSchemas);
const editMetadataFieldSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.editField);
const selectedMetadataFieldsSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.selectedFields);

/**
 * Service for registry related CRUD actions such as metadata schema, metadata field and bitstream format
 */
@Injectable()
export class RegistryService {

  private metadataSchemasPath = 'metadataschemas';
  private metadataFieldsPath = 'metadatafields';

  // private bitstreamFormatsPath = 'bitstreamformats';

  constructor(protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private halService: HALEndpointService,
              private store: Store<AppState>,
              private notificationsService: NotificationsService,
              private translateService: TranslateService) {

  }

  /**
   * Retrieves all metadata schemas
   * @param pagination The pagination info used to retrieve the schemas
   */
  public getMetadataSchemas(pagination: PaginationComponentOptions): Observable<RemoteData<PaginatedList<MetadataSchema>>> {
    const requestObs = this.getMetadataSchemasRequestObs(pagination);

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const rmrObs: Observable<RegistryMetadataschemasResponse> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryMetadataschemasSuccessResponse) => response.metadataschemasResponse)
    );

    const metadataschemasObs: Observable<MetadataSchema[]> = rmrObs.pipe(
      map((rmr: RegistryMetadataschemasResponse) => rmr.metadataschemas)
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryMetadataschemasSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(metadataschemasObs, pageInfoObs).pipe(
      map(([metadataschemas, pageInfo]) => {
        return new PaginatedList(pageInfo, metadataschemas);
      })
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
  }

  /**
   * Retrieves a metadata schema by its name
   * @param schemaName The name of the schema to find
   */
  public getMetadataSchemaByName(schemaName: string): Observable<RemoteData<MetadataSchema>> {
    // Temporary pagination to get ALL metadataschemas until there's a rest api endpoint for fetching a specific schema
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'all-metadatafields-pagination',
      pageSize: 10000
    });
    const requestObs = this.getMetadataSchemasRequestObs(pagination);

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const rmrObs: Observable<RegistryMetadataschemasResponse> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryMetadataschemasSuccessResponse) => response.metadataschemasResponse)
    );

    const metadataschemaObs: Observable<MetadataSchema> = rmrObs.pipe(
      map((rmr: RegistryMetadataschemasResponse) => rmr.metadataschemas),
      map((metadataSchemas: MetadataSchema[]) => metadataSchemas.filter((value) => value.prefix === schemaName)[0])
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, metadataschemaObs);
  }

  /**
   * retrieves all metadata fields that belong to a certain metadata schema
   * @param schema The schema to filter by
   * @param pagination The pagination info used to retrieve the fields
   */
  public getMetadataFieldsBySchema(schema: MetadataSchema, pagination: PaginationComponentOptions): Observable<RemoteData<PaginatedList<MetadataField>>> {
    const requestObs = this.getMetadataFieldsBySchemaRequestObs(pagination, schema);

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const rmrObs: Observable<RegistryMetadatafieldsResponse> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryMetadatafieldsSuccessResponse) => response.metadatafieldsResponse)
    );

    const metadatafieldsObs: Observable<MetadataField[]> = rmrObs.pipe(
      map((rmr: RegistryMetadatafieldsResponse) => rmr.metadatafields)
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),

      map((response: RegistryMetadatafieldsSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(metadatafieldsObs, pageInfoObs).pipe(
      map(([metadatafields, pageInfo]) => {
        return new PaginatedList(pageInfo, metadatafields);
      })
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
  }

  /**
   * Retrieve all existing metadata fields as a paginated list
   * @param pagination Pagination options to determine which page of metadata fields should be requested
   * When no pagination is provided, all metadata fields are requested in one large page
   * @returns an observable that emits a remote data object with a page of metadata fields
   */
  public getAllMetadataFields(pagination?: PaginationComponentOptions): Observable<RemoteData<PaginatedList<MetadataField>>> {
    if (hasNoValue(pagination)) {
      pagination = {currentPage: 1, pageSize: 10000} as any;
    }
    const requestObs = this.getMetadataFieldsRequestObs(pagination);

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const rmrObs: Observable<RegistryMetadatafieldsResponse> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryMetadatafieldsSuccessResponse) => response.metadatafieldsResponse)
    );

    const metadatafieldsObs: Observable<MetadataField[]> = rmrObs.pipe(
      map((rmr: RegistryMetadatafieldsResponse) => rmr.metadatafields),
      /* Make sure to explicitly cast this into a MetadataField object, on first page loads this object comes from the object cache created by the server and its prototype is unknown */
      map((metadataFields: MetadataField[]) => metadataFields.map((metadataField: MetadataField) => Object.assign(new MetadataField(), metadataField)))
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),

      map((response: RegistryMetadatafieldsSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(metadatafieldsObs, pageInfoObs).pipe(
      map(([metadatafields, pageInfo]) => {
        return new PaginatedList(pageInfo, metadatafields);
      })
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
  }

  public getMetadataSchemasRequestObs(pagination: PaginationComponentOptions): Observable<RestRequest> {
    return this.halService.getEndpoint(this.metadataSchemasPath).pipe(
      map((url: string) => {
        const args: string[] = [];
        args.push(`size=${pagination.pageSize}`);
        args.push(`page=${pagination.currentPage - 1}`);
        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistryMetadataschemasResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );
  }

  private getMetadataFieldsBySchemaRequestObs(pagination: PaginationComponentOptions, schema: MetadataSchema): Observable<RestRequest> {
    return this.halService.getEndpoint(this.metadataFieldsPath + '/search/bySchema').pipe(
      // return this.halService.getEndpoint(this.metadataFieldsPath).pipe(
      map((url: string) => {
        const args: string[] = [];
        args.push(`schema=${schema.prefix}`);
        args.push(`size=${pagination.pageSize}`);
        args.push(`page=${pagination.currentPage - 1}`);
        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistryMetadatafieldsResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );
  }

  private getMetadataFieldsRequestObs(pagination: PaginationComponentOptions): Observable<RestRequest> {
    return this.halService.getEndpoint(this.metadataFieldsPath).pipe(
      map((url: string) => {
        const args: string[] = [];
        args.push(`size=${pagination.pageSize}`);
        args.push(`page=${pagination.currentPage - 1}`);
        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistryMetadatafieldsResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );
  }

  public editMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistryEditSchemaAction(schema));
  }

  /**
   * Method to cancel editing a metadata schema, dispatches a cancel schema action
   */
  public cancelEditMetadataSchema() {
    this.store.dispatch(new MetadataRegistryCancelSchemaAction());
  }

  /**
   * Method to retrieve the metadata schema that are currently being edited
   */
  public getActiveMetadataSchema(): Observable<MetadataSchema> {
    return this.store.pipe(select(editMetadataSchemaSelector));
  }

  /**
   * Method to select a metadata schema, dispatches a select schema action
   * @param schema The schema that's being selected
   */
  public selectMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistrySelectSchemaAction(schema));
  }

  /**
   * Method to deselect a metadata schema, dispatches a deselect schema action
   * @param schema The schema that's it being deselected
   */
  public deselectMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistryDeselectSchemaAction(schema));
  }

  /**
   * Method to deselect all currently selected metadata schema, dispatches a deselect all schema action
   */
  public deselectAllMetadataSchema() {
    this.store.dispatch(new MetadataRegistryDeselectAllSchemaAction());
  }

  /**
   * Method to retrieve the metadata schemas that are currently selected
   */
  public getSelectedMetadataSchemas(): Observable<MetadataSchema[]> {
    return this.store.pipe(select(selectedMetadataSchemasSelector));
  }
  /**
   * Method to start editing a metadata field, dispatches an edit field action
   * @param field The field that's being edited
   */
  public editMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistryEditFieldAction(field));
  }

  /**
   * Method to cancel editing a metadata field, dispatches a cancel field action
   */
  public cancelEditMetadataField() {
    this.store.dispatch(new MetadataRegistryCancelFieldAction());
  }
  /**
   * Method to retrieve the metadata field that are currently being edited
   */
  public getActiveMetadataField(): Observable<MetadataField> {
    return this.store.pipe(select(editMetadataFieldSelector));
  }
  /**
   * Method to select a metadata field, dispatches a select field action
   * @param field The field that's being selected
   */
  public selectMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistrySelectFieldAction(field));
  }
  /**
   * Method to deselect a metadata field, dispatches a deselect field action
   * @param field The field that's it being deselected
   */
  public deselectMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistryDeselectFieldAction(field));
  }
  /**
   * Method to deselect all currently selected metadata fields, dispatches a deselect all field action
   */
  public deselectAllMetadataField() {
    this.store.dispatch(new MetadataRegistryDeselectAllFieldAction());
  }

  /**
   * Method to retrieve the metadata fields that are currently selected
   */
  public getSelectedMetadataFields(): Observable<MetadataField[]> {
    return this.store.pipe(select(selectedMetadataFieldsSelector));
  }

  /**
   * Create or Update a MetadataSchema
   *  If the MetadataSchema contains an id, it is assumed the schema already exists and is updated instead
   *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
   *  - On creation, a CreateMetadataSchemaRequest is used
   *  - On update, a UpdateMetadataSchemaRequest is used
   * @param schema    The MetadataSchema to create or update
   */
  public createOrUpdateMetadataSchema(schema: MetadataSchema): Observable<MetadataSchema> {
    const isUpdate = hasValue(schema.id);
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.metadataSchemasPath).pipe(
      isNotEmptyOperator(),
      map((endpoint: string) => (isUpdate ? `${endpoint}/${schema.id}` : endpoint)),
      distinctUntilChanged()
    );

    const serializedSchema = new DSpaceSerializer(getClassForType(MetadataSchema.type)).serialize(schema);

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        if (isUpdate) {
          const options: HttpOptions = Object.create({});
          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          options.headers = headers;
          return new UpdateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema), options);
        } else {
          return new CreateMetadataSchemaRequest(requestId, endpoint, JSON.stringify(serializedSchema));
        }
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return created/updated schema
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful) {
          if (hasValue((response as any).errorMessage)) {
            this.notificationsService.error('Server Error:', (response as any).errorMessage, new NotificationOptions(-1));
          }
        } else {
          this.showNotifications(true, isUpdate, false, {prefix: schema.prefix});
          return response;
        }
      }),
      isNotEmptyOperator(),
      map((response: MetadataschemaSuccessResponse) => {
        if (isNotEmpty(response.metadataschema)) {
          return response.metadataschema;
        }
      })
    );
  }

  /**
   * Method to delete a metadata schema
   * @param id The id of the metadata schema to delete
   */
  public deleteMetadataSchema(id: number): Observable<RestResponse> {
    return this.delete(this.metadataSchemasPath, id);
  }

  /**
   * Method that clears a cached metadata schema request and returns its REST url
   */
  public clearMetadataSchemaRequests(): Observable<string> {
    return this.halService.getEndpoint(this.metadataSchemasPath).pipe(
      tap((href: string) => this.requestService.removeByHrefSubstring(href))
    );
  }

  /**
   * Create or Update a MetadataField
   *  If the MetadataField contains an id, it is assumed the field already exists and is updated instead
   *  Since creating or updating is nearly identical, the only real difference is the request (and slight difference in endpoint):
   *  - On creation, a CreateMetadataFieldRequest is used
   *  - On update, a UpdateMetadataFieldRequest is used
   * @param field    The MetadataField to create or update
   */
  public createOrUpdateMetadataField(field: MetadataField): Observable<MetadataField> {
    const isUpdate = hasValue(field.id);
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(this.metadataFieldsPath).pipe(
      isNotEmptyOperator(),
      map((endpoint: string) => (isUpdate ? `${endpoint}/${field.id}` : `${endpoint}?schemaId=${field.schema.id}`)),
      distinctUntilChanged()
    );

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => {
        if (isUpdate) {
          const options: HttpOptions = Object.create({});
          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          options.headers = headers;
          return new UpdateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field), options);
        } else {
          return new CreateMetadataFieldRequest(requestId, endpoint, JSON.stringify(field));
        }
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return created/updated field
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful) {
          if (hasValue((response as any).errorMessage)) {
            this.notificationsService.error('Server Error:', (response as any).errorMessage, new NotificationOptions(-1));
          }
        } else {
          const fieldString = `${field.schema.prefix}.${field.element}${field.qualifier ? `.${field.qualifier}` : ''}`;
          this.showNotifications(true, isUpdate, true, {field: fieldString});
          return response;
        }
      }),
      isNotEmptyOperator(),
      map((response: MetadatafieldSuccessResponse) => {
        if (isNotEmpty(response.metadatafield)) {
          return response.metadatafield;
        }
      })
    );
  }

  /**
   * Method to delete a metadata field
   * @param id The id of the metadata field to delete
   */
  public deleteMetadataField(id: number): Observable<RestResponse> {
    return this.delete(this.metadataFieldsPath, id);
  }
  /**
   * Method that clears a cached metadata field request and returns its REST url
   */
  public clearMetadataFieldRequests(): Observable<string> {
    return this.halService.getEndpoint(this.metadataFieldsPath).pipe(
      tap((href: string) => this.requestService.removeByHrefSubstring(href))
    );
  }

  private delete(path: string, id: number): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const endpoint$ = this.halService.getEndpoint(path).pipe(
      isNotEmptyOperator(),
      map((endpoint: string) => `${endpoint}/${id}`),
      distinctUntilChanged()
    );

    const request$ = endpoint$.pipe(
      take(1),
      map((endpoint: string) => new DeleteRequest(requestId, endpoint))
    );

    // Execute the delete request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
  }

  private showNotifications(success: boolean, edited: boolean, isField: boolean, options: any) {
    const prefix = 'admin.registries.schema.notification';
    const suffix = success ? 'success' : 'failure';
    const editedString = edited ? 'edited' : 'created';
    const messages = observableCombineLatest(
      this.translateService.get(success ? `${prefix}.${suffix}` : `${prefix}.${suffix}`),
      this.translateService.get(`${prefix}${isField ? '.field' : ''}.${editedString}`, options)
    );
    messages.subscribe(([head, content]) => {
      if (success) {
        this.notificationsService.success(head, content);
      } else {
        this.notificationsService.error(head, content);
      }
    });
  }

  /**
   * Retrieve a filtered paginated list of metadata fields
   * @param query {string} The query to filter the field names by
   * @returns an observable that emits a remote data object with a page of metadata fields that match the query
   */
  queryMetadataFields(query: string): Observable<RemoteData<PaginatedList<MetadataField>>> {
    return this.getAllMetadataFields().pipe(
      map((rd: RemoteData<PaginatedList<MetadataField>>) => {
        const filteredFields: MetadataField[] = rd.payload.page.filter(
          (field: MetadataField) => field.toString().indexOf(query) >= 0
        );
        const page: PaginatedList<MetadataField> = new PaginatedList<MetadataField>(new PageInfo(), filteredFields)
        return Object.assign({}, rd, { payload: page });
      })
    );
  }
}

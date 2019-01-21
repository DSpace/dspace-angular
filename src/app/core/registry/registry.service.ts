import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { MetadataSchema } from '../metadata/metadataschema.model';
import { MetadataField } from '../metadata/metadatafield.model';
import { BitstreamFormat } from './mock-bitstream-format.model';
import { GetRequest, RestRequest } from '../data/request.models';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from '../data/parsing.service';
import { RegistryMetadataschemasResponseParsingService } from '../data/registry-metadataschemas-response-parsing.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { RegistryMetadataschemasResponse } from './registry-metadataschemas-response.model';
import {
  RegistryBitstreamformatsSuccessResponse,
  RegistryMetadatafieldsSuccessResponse,
  RegistryMetadataschemasSuccessResponse
} from '../cache/response.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RegistryMetadatafieldsResponseParsingService } from '../data/registry-metadatafields-response-parsing.service';
import { RegistryMetadatafieldsResponse } from './registry-metadatafields-response.model';
import { isNotEmpty } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { RegistryBitstreamformatsResponseParsingService } from '../data/registry-bitstreamformats-response-parsing.service';
import { RegistryBitstreamformatsResponse } from './registry-bitstreamformats-response.model';
import { getResponseFromEntry } from '../shared/operators';
import { createSelector, select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { MetadataRegistryState } from '../../+admin/admin-registries/metadata-registry/metadata-registry.reducers';
import {
  MetadataRegistryCancelFieldAction,
  MetadataRegistryCancelSchemaAction,
  MetadataRegistryDeselectFieldAction,
  MetadataRegistryDeselectSchemaAction,
  MetadataRegistryEditFieldAction,
  MetadataRegistryEditSchemaAction,
  MetadataRegistrySelectFieldAction,
  MetadataRegistrySelectSchemaAction
} from '../../+admin/admin-registries/metadata-registry/metadata-registry.actions';
import { flatMap, map, tap } from 'rxjs/operators';

const metadataRegistryStateSelector = (state: AppState) => state.metadataRegistry;
const editMetadataSchemaSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.editSchema);
const selectedMetadataSchemasSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.selectedSchemas);
const editMetadataFieldSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.editField);
const selectedMetadataFieldsSelector = createSelector(metadataRegistryStateSelector, (metadataState: MetadataRegistryState) => metadataState.selectedFields);

@Injectable()
export class RegistryService {

  private metadataSchemasPath = 'metadataschemas';
  private metadataFieldsPath = 'metadatafields';
  private bitstreamFormatsPath = 'bitstreamformats';

  constructor(protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private halService: HALEndpointService,
              private store: Store<AppState>) {

  }

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

  public getBitstreamFormats(pagination: PaginationComponentOptions): Observable<RemoteData<PaginatedList<BitstreamFormat>>> {
    const requestObs = this.getBitstreamFormatsRequestObs(pagination);

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const rbrObs: Observable<RegistryBitstreamformatsResponse> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryBitstreamformatsSuccessResponse) => response.bitstreamformatsResponse)
    );

    const bitstreamformatsObs: Observable<BitstreamFormat[]> = rbrObs.pipe(
      map((rbr: RegistryBitstreamformatsResponse) => rbr.bitstreamformats)
    );

    const pageInfoObs: Observable<PageInfo> = requestEntryObs.pipe(
      getResponseFromEntry(),
      map((response: RegistryBitstreamformatsSuccessResponse) => response.pageInfo)
    );

    const payloadObs = observableCombineLatest(bitstreamformatsObs, pageInfoObs).pipe(
      map(([bitstreamformats, pageInfo]) => {
        return new PaginatedList(pageInfo, bitstreamformats);
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

  private getBitstreamFormatsRequestObs(pagination: PaginationComponentOptions): Observable<RestRequest> {
    return this.halService.getEndpoint(this.bitstreamFormatsPath).pipe(
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
            return RegistryBitstreamformatsResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );
  }

  public editMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistryEditSchemaAction(schema));
  }

  public cancelEditMetadataSchema() {
    this.store.dispatch(new MetadataRegistryCancelSchemaAction());
  }

  public getActiveMetadataSchema(): Observable<MetadataSchema> {
    return this.store.pipe(select(editMetadataSchemaSelector));
  }

  public selectMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistrySelectSchemaAction(schema))
  }

  public deselectMetadataSchema(schema: MetadataSchema) {
    this.store.dispatch(new MetadataRegistryDeselectSchemaAction(schema))
  }

  public getSelectedMetadataSchemas(): Observable<MetadataSchema[]> {
    return this.store.pipe(select(selectedMetadataSchemasSelector));
  }

  public editMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistryEditFieldAction(field));
  }

  public cancelEditMetadataField() {
    this.store.dispatch(new MetadataRegistryCancelFieldAction());
  }

  public getActiveMetadataField(): Observable<MetadataField> {
    return this.store.pipe(select(editMetadataFieldSelector));
  }

  public selectMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistrySelectFieldAction(field))
  }

  public deselectMetadataField(field: MetadataField) {
    this.store.dispatch(new MetadataRegistryDeselectFieldAction(field))
  }

  public getSelectedMetadataFields(): Observable<MetadataField[]> {
    return this.store.pipe(select(selectedMetadataFieldsSelector));
  }

  // public createMetadataSchema(schema: MetadataSchema): Observable<RemoteData<MetadataSchema>> {
  //   const requestId = this.requestService.generateRequestId();
  //   const endpoint$ = this.halService.getEndpoint(this.metadataSchemasPath).pipe(
  //     isNotEmptyOperator(),
  //     distinctUntilChanged()
  //   );
  //
  //   const serializedDso = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(MetadataSchema.type)).serialize(normalizedObject);
  //
  //   const request$ = endpoint$.pipe(
  //     take(1),
  //     map((endpoint: string) => new CreateRequest(requestId, endpoint, JSON.stringify(serializedDso)))
  //   );
  //
  //   // Execute the post request
  //   request$.pipe(
  //     configureRequest(this.requestService)
  //   ).subscribe();
  //
  //   // Resolve self link for new object
  //   const selfLink$ = this.requestService.getByUUID(requestId).pipe(
  //     getResponseFromEntry(),
  //     map((response: RestResponse) => {
  //       if (!response.isSuccessful && response instanceof ErrorResponse) {
  //         this.notificationsService.error('Server Error:', response.errorMessage, new NotificationOptions(-1));
  //       } else {
  //         return response;
  //       }
  //     }),
  //     map((response: any) => {
  //       if (isNotEmpty(response.resourceSelfLinks)) {
  //         return response.resourceSelfLinks[0];
  //       }
  //     }),
  //     distinctUntilChanged()
  //   ) as Observable<string>;
  //
  //   return selfLink$.pipe(
  //     switchMap((selfLink: string) => this.findByHref(selfLink)),
  //   )
  // }
}

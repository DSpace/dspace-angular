import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { MetadataSchema } from '../metadata/metadataschema.model';
import { MetadataField } from '../metadata/metadatafield.model';
import { BitstreamFormat } from './mock-bitstream-format.model';
import { flatMap, map, tap } from 'rxjs/operators';
import { GetRequest, RestRequest } from '../data/request.models';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from '../data/parsing.service';
import { RegistryMetadataschemasResponseParsingService } from '../data/registry-metadataschemas-response-parsing.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RegistryMetadataschemasResponse } from './registry-metadataschemas-response.model';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { MetadataschemaSuccessResponse, RegistryMetadataschemasSuccessResponse } from '../cache/response-cache.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { MetadataschemaParsingService } from '../data/metadataschema-parsing.service';

@Injectable()
export class RegistryService {

  private metadataSchemasPath = 'metadataschemas';

  metadataSchemas: MetadataSchema[];
  metadataFields: MetadataField[];
  bitstreamFormats: BitstreamFormat[];

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private halService: HALEndpointService) {

  }

  public getMetadataSchemas(): Observable<RemoteData<PaginatedList<MetadataSchema>>> {
    const requestObs = this.halService.getEndpoint(this.metadataSchemasPath).pipe(
      map((url: string) => {
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistryMetadataschemasResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    const rmrObs: Observable<RegistryMetadataschemasResponse> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: RegistryMetadataschemasSuccessResponse) => response.metadataschemasResponse)
    );

    const metadataschemasObs: Observable<MetadataSchema[]> = rmrObs.pipe(
      map((rmr: RegistryMetadataschemasResponse) => rmr.metadataschemas)
    );

    const pageInfoObs: Observable<PageInfo> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: RegistryMetadataschemasSuccessResponse) => response.pageInfo)
    );

    const payloadObs = Observable.combineLatest(metadataschemasObs, pageInfoObs, (metadataschemas, pageInfo) => {
      return new PaginatedList(pageInfo, metadataschemas);
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  public getMetadataSchemaByName(schemaName: string): Observable<RemoteData<MetadataSchema>> {
    const requestObs = this.halService.getEndpoint(this.metadataSchemasPath).pipe(
      map((url: string) => {
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return RegistryMetadataschemasResponseParsingService;
          }
        });
      }),
      tap((request: RestRequest) => this.requestService.configure(request)),
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    const rmrObs: Observable<RegistryMetadataschemasResponse> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: RegistryMetadataschemasSuccessResponse) => response.metadataschemasResponse)
    );

    const metadataschemaObs: Observable<MetadataSchema> = rmrObs.pipe(
      map((rmr: RegistryMetadataschemasResponse) => rmr.metadataschemas),
      map((metadataSchemas: MetadataSchema[]) => metadataSchemas.filter((value) => value.prefix === schemaName)[0])
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, metadataschemaObs);
  }

  public getMetadataFieldsBySchema(schema: MetadataSchema): Observable<RemoteData<PaginatedList<MetadataField>>> {
    const pageInfo = new PageInfo();
    pageInfo.elementsPerPage = 10;
    pageInfo.currentPage = 1;

    const payload = new PaginatedList(pageInfo, this.metadataFields.filter((value) => value.schema === schema));
    const remoteData = new RemoteData(false, false, true, undefined, payload);
    return Observable.of(remoteData);
  }

  public getBitstreamFormats(): Observable<RemoteData<PaginatedList<BitstreamFormat>>> {
    const pageInfo = new PageInfo();
    pageInfo.elementsPerPage = 10;
    pageInfo.currentPage = 1;

    const payload = new PaginatedList(pageInfo, this.bitstreamFormats);
    const remoteData = new RemoteData(false, false, true, undefined, payload);
    return Observable.of(remoteData);
  }

}

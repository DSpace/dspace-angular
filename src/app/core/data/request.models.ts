import { SortOptions } from '../cache/models/sort-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { BrowseEntriesResponseParsingService } from './browse-entries-response-parsing.service';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { EndpointMapResponseParsingService } from './endpoint-map-response-parsing.service';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { ConfigResponseParsingService } from '../config/config-response-parsing.service';
import { AuthResponseParsingService } from '../auth/auth-response-parsing.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionResponseParsingService } from '../submission/submission-response-parsing.service';
import { IntegrationResponseParsingService } from '../integration/integration-response-parsing.service';
import { RestRequestMethod } from './rest-request-method';
import { SearchParam } from '../cache/models/search-param.model';
import { EpersonResponseParsingService } from '../eperson/eperson-response-parsing.service';
import { BrowseItemsResponseParsingService } from './browse-items-response-parsing-service';
import { MetadataschemaParsingService } from './metadataschema-parsing.service';
import { MetadatafieldParsingService } from './metadatafield-parsing.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { TaskResponseParsingService } from '../tasks/task-response-parsing.service';

/* tslint:disable:max-classes-per-file */

export abstract class RestRequest {
  public responseMsToLive = 0;
  constructor(
    public uuid: string,
    public href: string,
    public method: RestRequestMethod = RestRequestMethod.GET,
    public body?: any,
    public options?: HttpOptions,
  ) {
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DSOResponseParsingService;
  }

  get toCache(): boolean {
    return this.responseMsToLive > 0;
  }
}

export class GetRequest extends RestRequest {
  public responseMsToLive = 60 * 15 * 1000;

  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
  )  {
    super(uuid, href, RestRequestMethod.GET, body, options)
  }
}

export class PostRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.POST, body)
  }
}

export class PutRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.PUT, body)
  }
}

export class DeleteRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.DELETE, body)
  }
}

export class OptionsRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.OPTIONS, body)
  }
}

export class HeadRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.HEAD, body)
  }
}

export class PatchRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions
  )  {
    super(uuid, href, RestRequestMethod.PATCH, body)
  }
}

export class FindByIDRequest extends GetRequest {
  constructor(
    uuid: string,
    href: string,
    public resourceID: string
  ) {
    super(uuid, href);
  }
}

export class FindAllOptions {
  scopeID?: string;
  elementsPerPage?: number;
  currentPage?: number;
  sort?: SortOptions;
  searchParams?: SearchParam[];
  startsWith?: string;
}

export class FindAllRequest extends GetRequest {
  constructor(
    uuid: string,
    href: string,
    public body?: FindAllOptions,
  ) {
    super(uuid, href);
  }
}

export class EndpointMapRequest extends GetRequest {
  constructor(
    uuid: string,
    href: string,
    body?: any
  ) {
    super(uuid, new URLCombiner(href, '?endpointMap').toString(), body);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return EndpointMapResponseParsingService;
  }
}

export class BrowseEndpointRequest extends GetRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseResponseParsingService;
  }
}

export class BrowseEntriesRequest extends GetRequest {
  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseEntriesResponseParsingService;
  }
}

export class BrowseItemsRequest extends GetRequest {
  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseItemsResponseParsingService;
  }
}

export class ConfigRequest extends GetRequest {
  constructor(uuid: string, href: string, public options?: HttpOptions) {
    super(uuid, href, null, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return ConfigResponseParsingService;
  }
}

export class AuthPostRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return AuthResponseParsingService;
  }
}

export class AuthGetRequest extends GetRequest {
  constructor(uuid: string, href: string, public options?: HttpOptions) {
    super(uuid, href, null, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return AuthResponseParsingService;
  }
}

export class IntegrationRequest extends GetRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return IntegrationResponseParsingService;
  }
}

/**
 * Request to create a MetadataSchema
 */
export class CreateMetadataSchemaRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return MetadataschemaParsingService;
  }
}

/**
 * Request to update a MetadataSchema
 */
export class UpdateMetadataSchemaRequest extends PutRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return MetadataschemaParsingService;
  }
}

/**
 * Request to create a MetadataField
 */
export class CreateMetadataFieldRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return MetadatafieldParsingService;
  }
}

/**
 * Request to update a MetadataField
 */
export class UpdateMetadataFieldRequest extends PutRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return MetadatafieldParsingService;
  }
}

/**
 * Class representing a submission HTTP GET request object
 */
export class SubmissionRequest extends GetRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

/**
 * Class representing a submission HTTP DELETE request object
 */
export class SubmissionDeleteRequest extends DeleteRequest {
  constructor(public uuid: string,
              public href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

/**
 * Class representing a submission HTTP PATCH request object
 */
export class SubmissionPatchRequest extends PatchRequest {
  constructor(public uuid: string,
              public href: string,
              public body?: any) {
    super(uuid, href, body);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

/**
 * Class representing a submission HTTP POST request object
 */
export class SubmissionPostRequest extends PostRequest {
  constructor(public uuid: string,
              public href: string,
              public body?: any,
              public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

/**
 * Class representing an eperson HTTP GET request object
 */
export class EpersonRequest extends GetRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return EpersonResponseParsingService;
  }
}

export class CreateRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DSOResponseParsingService;
  }
}

/**
 * Request to delete an object based on its identifier
 */
export class DeleteByIDRequest extends DeleteRequest {
  constructor(
    uuid: string,
    href: string,
    public resourceID: string
  ) {
    super(uuid, href);
  }
}

export class TaskPostRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return TaskResponseParsingService;
  }
}

export class TaskDeleteRequest extends DeleteRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions) {
    super(uuid, href, body, options);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return TaskResponseParsingService;
  }
}

export class MyDSpaceRequest extends GetRequest {
  public responseMsToLive = 0;
}

export class RequestError extends Error {
  statusCode: number;
  statusText: string;
}
/* tslint:enable:max-classes-per-file */

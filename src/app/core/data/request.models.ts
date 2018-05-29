import { SortOptions } from '../cache/models/sort-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { GlobalConfig } from '../../../config/global-config.interface';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { BrowseEntriesResponseParsingService } from './browse-entries-response-parsing.service';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { EndpointMapResponseParsingService } from './endpoint-map-response-parsing.service';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { ConfigResponseParsingService } from './config-response-parsing.service';

/* tslint:disable:max-classes-per-file */

/**
 * Represents a Request Method.
 *
 * I didn't reuse the RequestMethod enum in @angular/http because
 * it uses numbers. The string values here are more clear when
 * debugging.
 *
 * The ones commented out are still unsupported in the rest of the codebase
 */
export enum RestRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Options = 'OPTIONS',
  Head = 'HEAD',
  Patch = 'PATCH'
}

export abstract class RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public method: RestRequestMethod = RestRequestMethod.Get,
    public body?: any
  ) {
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DSOResponseParsingService;
  }
}

export class GetRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Get, body)
  }
}

export class PostRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Post, body)
  }
}

export class PutRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Put, body)
  }
}

export class DeleteRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Delete, body)
  }
}

export class OptionsRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Options, body)
  }
}

export class HeadRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Head, body)
  }
}

export class PatchRequest extends RestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  )  {
    super(uuid, href, RestRequestMethod.Patch, body)
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
}

export class FindAllRequest extends GetRequest {
  constructor(
    uuid: string,
    href: string,
    public options?: FindAllOptions,
  ) {
    super(uuid, href);
  }
}

export class EndpointMapRequest extends GetRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any
  ) {
    super(uuid, href, body);
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

export class ConfigRequest extends GetRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return ConfigResponseParsingService;
  }
}

export class RequestError extends Error {
  statusText: string;
}
/* tslint:enable:max-classes-per-file */

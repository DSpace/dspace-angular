import { SortOptions } from '../cache/models/sort-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { GlobalConfig } from '../../../config/global-config.interface';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RootResponseParsingService } from './root-response-parsing.service';
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
  // Put = 'PUT',
  // Delete = 'DELETE',
  // Options = 'OPTIONS',
  // Head = 'HEAD',
  // Patch = 'PATCH'
}

export class RestRequest {
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

export class FindByIDRequest extends RestRequest {
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

export class FindAllRequest extends RestRequest {
  constructor(
    uuid: string,
    href: string,
    public options?: FindAllOptions,
  ) {
    super(uuid, href);
  }
}

export class RootEndpointRequest extends RestRequest {
  constructor(uuid: string, EnvConfig: GlobalConfig) {
    const href = new RESTURLCombiner(EnvConfig, '/').toString();
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return RootResponseParsingService;
  }
}

export class BrowseEndpointRequest extends RestRequest {
  constructor(uuid: string, href: string) {
    super(uuid, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseResponseParsingService;
  }
}

export class ConfigRequest extends RestRequest {
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

import { RequestOptionsArgs } from '@angular/http';

import { SortOptions } from '../cache/models/sort-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { GlobalConfig } from '../../../config/global-config.interface';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RootResponseParsingService } from './root-response-parsing.service';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { ConfigResponseParsingService } from './config-response-parsing.service';
import { SubmissionResponseParsingService } from './submission-response-parsing.service';
import { EpersonResponseParsingService } from '../eperson/eperson-response-parsing.service';
import { IntegrationResponseParsingService } from '../integration/integration-response-parsing.service';

export enum RequestType {
  DELETE = 'DELETE',
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
}

/* tslint:disable:max-classes-per-file */
export abstract class RestRequest {
  constructor(public requestType: RequestType,
              public href: string,
              public body?: any,
              public requestOptions?: RequestOptionsArgs,) {
  }

  abstract getResponseParser(): GenericConstructor<ResponseParsingService>;
}

export abstract class HttpDeleteRequest extends RestRequest {
  constructor(href: string,) {
    super(RequestType.DELETE, href);
  }
}

export class HttpGetRequest extends RestRequest {
  constructor(href: string,) {
    super(RequestType.GET, href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DSOResponseParsingService;
  }
}

export class HttpPostRequest extends RestRequest {
  constructor(href: string,
              body: any,) {
    super(RequestType.POST, href, body);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

export class HttpPatchRequest extends RestRequest {
  constructor(href: string,
              body: any,) {
    super(RequestType.PATCH, href, body);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

export class FindByIDRequest extends HttpGetRequest {
  constructor(href: string,
              public resourceID: string) {
    super(href);
  }
}

export class FindAllOptions {
  scopeID?: string;
  elementsPerPage?: number;
  currentPage?: number;
  sort?: SortOptions;
}

export class FindAllRequest extends HttpGetRequest {
  constructor(href: string,
              public options?: FindAllOptions,) {
    super(href);
  }
}

export class RootEndpointRequest extends HttpGetRequest {
  constructor(EnvConfig: GlobalConfig) {
    const href = new RESTURLCombiner(EnvConfig, '/').toString();
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return RootResponseParsingService;
  }
}

export class BrowseEndpointRequest extends HttpGetRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseResponseParsingService;
  }
}

export class ConfigRequest extends HttpGetRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return ConfigResponseParsingService;
  }
}

export class SubmissionRequest extends HttpGetRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

export class SubmissionDeleteRequest extends HttpDeleteRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

export class EpersonRequest extends HttpGetRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return EpersonResponseParsingService;
  }
}

export class IntegrationRequest extends HttpGetRequest {
  constructor(href: string) {
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return IntegrationResponseParsingService;
  }
}

export class RequestError extends Error {
  statusText: string;
}

/* tslint:enable:max-classes-per-file */

/* eslint-disable max-classes-per-file */
import { RestRequestMethod } from '@dspace/config/rest-request-method';

import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { SubmissionResponseParsingService } from '../submission/submission-response-parsing.service';
import { TaskResponseParsingService } from '../tasks/task-response-parsing.service';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { ContentSourceResponseParsingService } from './content-source-response-parsing.service';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { EndpointMapResponseParsingService } from './endpoint-map-response-parsing.service';
import { FindListOptions } from './find-list-options.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequestWithResponseParser } from './rest-request-with-response-parser.model';


// uuid and handle requests have separate endpoints
export enum IdentifierType {
  UUID = 'uuid',
  HANDLE = 'handle'
}

class DSpaceRestRequest extends RestRequestWithResponseParser {
  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DspaceRestResponseParsingService;
  }
}

export class GetRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.GET, body, options);
  }
}

export class PostRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.POST, body);
  }
}

/**
 * Request representing a multipart post request
 */
export class MultipartPostRequest extends DSpaceRestRequest {
  public isMultipart = true;
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  )  {
    super(uuid, href, RestRequestMethod.POST, body);
  }
}

export class PutRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.PUT, body);
  }
}

export class DeleteRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.DELETE, body);
  }
}

export class OptionsRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.OPTIONS, body);
  }
}

export class HeadRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.HEAD, body);
  }
}

export class PatchRequest extends DSpaceRestRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, RestRequestMethod.PATCH, body);
  }
}

/**
 * Class representing a BrowseDefinition HTTP Rest request object
 */
export class BrowseDefinitionRestRequest extends DSpaceRestRequest {
  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return BrowseResponseParsingService;
  }
}

export class FindListRequest extends GetRequest {
  constructor(
    uuid: string,
    href: string,
    public body?: FindListOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, body, null, responseMsToLive);
  }
}

export class EndpointMapRequest extends GetRequest {
  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return EndpointMapResponseParsingService;
  }
}

/**
 * Class representing a submission HTTP GET request object
 */
export class SubmissionRequest extends GetRequest {
  constructor(uuid: string, href: string, responseMsToLive?: number) {
    super(uuid, href, null, null, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

/**
 * Class representing a submission HTTP DELETE request object
 */
export class SubmissionDeleteRequest extends DeleteRequest {
  constructor(public uuid: string, public href: string, public responseMsToLive?: number) {
    super(uuid, href, null, null, responseMsToLive);
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
              public body?: any,
              public responseMsToLive?: number) {
    super(uuid, href, body, null, responseMsToLive);
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
              public options?: HttpOptions,
              public responseMsToLive?: number) {
    super(uuid, href, body, options, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return SubmissionResponseParsingService;
  }
}

export class CreateRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions, public responseMsToLive?: number) {
    super(uuid, href, body, options, responseMsToLive);
  }
}

export class ContentSourceRequest extends GetRequest {
  constructor(uuid: string, href: string, public responseMsToLive?: number) {
    super(uuid, href, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return ContentSourceResponseParsingService;
  }
}

export class UpdateContentSourceRequest extends PutRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions, public responseMsToLive?: number) {
    super(uuid, href, body, options, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return ContentSourceResponseParsingService;
  }
}

/**
 * Request to delete an object based on its identifier
 */
export class DeleteByIDRequest extends DeleteRequest {
  constructor(
    uuid: string,
    href: string,
    public resourceID: string,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, null, null, responseMsToLive);
  }
}

export class TaskPostRequest extends PostRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions, public responseMsToLive?: number) {
    super(uuid, href, body, options, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return TaskResponseParsingService;
  }
}

export class TaskDeleteRequest extends DeleteRequest {
  constructor(uuid: string, href: string, public body?: any, public options?: HttpOptions,public responseMsToLive?: number) {
    super(uuid, href, body, options, responseMsToLive);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return TaskResponseParsingService;
  }
}

export class MyDSpaceRequest extends GetRequest {
  constructor(
    public uuid: string,
    public href: string,
    public body?: any,
    public options?: HttpOptions,
    public responseMsToLive?: number,
  ) {
    super(uuid, href, body, options, 10 * 1000);
  }
}

import { SortOptions } from '../cache/models/sort-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { GlobalConfig } from '../../../config/global-config.interface';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RootResponseParsingService } from './root-response-parsing.service';

/* tslint:disable:max-classes-per-file */
export class RestRequest {
  constructor(
    public href: string,
  ) { }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return DSOResponseParsingService;
  }
}

export class FindByIDRequest extends RestRequest {
  constructor(
    href: string,
    public resourceID: string
  ) {
    super(href);
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
    href: string,
    public options?: FindAllOptions,
  ) {
    super(href);
  }
}

export class RootEndpointRequest extends RestRequest {
  constructor(EnvConfig: GlobalConfig) {
    const href = new RESTURLCombiner(EnvConfig, '/').toString();
    super(href);
  }

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return RootResponseParsingService;
  }
}

export class RequestError extends Error {
  statusText: string;
}
/* tslint:enable:max-classes-per-file */

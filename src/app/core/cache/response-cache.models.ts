import { RequestError } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { ConfigObject } from '../shared/config/config.model';
import { AuthTokenInfo } from '../auth/models/auth-token-info.model';
import { NormalizedAuthStatus } from '../auth/models/normalized-auth-status.model';
import { AuthStatus } from '../auth/models/auth-status.model';

/* tslint:disable:max-classes-per-file */
export class RestResponse {
  public toCache = true;
  constructor(
    public isSuccessful: boolean,
    public statusCode: string,
  ) { }
}

export class DSOSuccessResponse extends RestResponse {
  constructor(
    public resourceSelfLinks: string[],
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class EndpointMap {
  [linkName: string]: string
}

export class RootSuccessResponse extends RestResponse {
  constructor(
    public endpointMap: EndpointMap,
    public statusCode: string,
  ) {
    super(true, statusCode);
  }
}

export class BrowseSuccessResponse extends RestResponse {
  constructor(
    public browseDefinitions: BrowseDefinition[],
    public statusCode: string
  ) {
    super(true, statusCode);
  }
}

export class ErrorResponse extends RestResponse {
  errorMessage: string;

  constructor(error: RequestError) {
    super(false, error.statusText);
    console.error(error);
    this.errorMessage = error.message;
  }
}

export class ConfigSuccessResponse extends RestResponse {
  constructor(
    public configDefinition: ConfigObject[],
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class AuthStatusResponse extends RestResponse {
  public toCache = false;
  constructor(
    public response: AuthStatus,
    public statusCode: string
  ) {
    super(true, statusCode);
  }
}

export class AuthSuccessResponse extends RestResponse {
  public toCache = false;
  constructor(
    public response: AuthTokenInfo,
    public statusCode: string
  ) {
    super(true, statusCode);
  }
}

export class AuthErrorResponse extends RestResponse {
  public toCache = false;
  constructor(
    public response: any,
    public statusCode: string,
  ) {
    super(true, statusCode);
  }
}
/* tslint:enable:max-classes-per-file */

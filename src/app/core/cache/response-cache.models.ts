import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { RequestError } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';
import { ConfigObject } from '../shared/config/config.model';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { IntegrationModel } from '../integration/models/integration.model';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';
import { MetadataSchema } from '../metadata/metadataschema.model';
import { RegistryMetadatafieldsResponse } from '../registry/registry-metadatafields-response.model';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';
import { AuthStatus } from '../auth/models/auth-status.model';

/* tslint:disable:max-classes-per-file */
export class RestResponse {
  public toCache = true;

  constructor(
    public isSuccessful: boolean,
    public statusCode: string,
  ) {
  }
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

export class RegistryMetadataschemasSuccessResponse extends RestResponse {
  constructor(
    public metadataschemasResponse: RegistryMetadataschemasResponse,
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class RegistryMetadatafieldsSuccessResponse extends RestResponse {
  constructor(
    public metadatafieldsResponse: RegistryMetadatafieldsResponse,
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class RegistryBitstreamformatsSuccessResponse extends RestResponse {
  constructor(
    public bitstreamformatsResponse: RegistryBitstreamformatsResponse,
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class MetadataschemaSuccessResponse extends RestResponse {
  constructor(
    public metadataschema: MetadataSchema,
    public statusCode: string
  ) {
    super(true, statusCode);
  }
}

export class SearchSuccessResponse extends RestResponse {
  constructor(
    public results: SearchQueryResponse,
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class FacetConfigSuccessResponse extends RestResponse {
  constructor(
    public results: SearchFilterConfig[],
    public statusCode: string
  ) {
    super(true, statusCode);
  }
}

export class FacetValueMap {
  [name: string]: FacetValueSuccessResponse
}

export class FacetValueSuccessResponse extends RestResponse {
  constructor(
    public results: FacetValue[],
    public statusCode: string,
    public pageInfo?: PageInfo) {
    super(true, statusCode);
  }
}

export class FacetValueMapSuccessResponse extends RestResponse {
  constructor(
    public results: FacetValueMap,
    public statusCode: string,
  ) {
    super(true, statusCode);
  }
}

export class EndpointMap {
  [linkPath: string]: string
}

export class EndpointMapSuccessResponse extends RestResponse {
  constructor(
    public endpointMap: EndpointMap,
    public statusCode: string,
  ) {
    super(true, statusCode);
  }
}

export class GenericSuccessResponse<T> extends RestResponse {
  constructor(
    public payload: T,
    public statusCode: string,
    public pageInfo?: PageInfo
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

export class IntegrationSuccessResponse extends RestResponse {
  constructor(
    public dataDefinition: IntegrationModel[],
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

/* tslint:enable:max-classes-per-file */

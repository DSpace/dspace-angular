import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { RequestError } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';
import { ConfigObject } from '../config/models/config.model';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { IntegrationModel } from '../integration/models/integration.model';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';
import { MetadataSchema } from '../metadata/metadataschema.model';
import { RegistryMetadatafieldsResponse } from '../registry/registry-metadatafields-response.model';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';
import { AuthStatus } from '../auth/models/auth-status.model';
import { NormalizedObject } from './models/normalized-object.model';
import { PaginatedList } from '../data/paginated-list';

/* tslint:disable:max-classes-per-file */
export class RestResponse {
  public toCache = true;

  constructor(
    public isSuccessful: boolean,
    public statusCode: number,
    public statusText: string
  ) {
  }
}

export class DSOSuccessResponse extends RestResponse {
  constructor(
    public resourceSelfLinks: string[],
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class RegistryMetadataschemasSuccessResponse extends RestResponse {
  constructor(
    public metadataschemasResponse: RegistryMetadataschemasResponse,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class RegistryMetadatafieldsSuccessResponse extends RestResponse {
  constructor(
    public metadatafieldsResponse: RegistryMetadatafieldsResponse,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class RegistryBitstreamformatsSuccessResponse extends RestResponse {
  constructor(
    public bitstreamformatsResponse: RegistryBitstreamformatsResponse,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class MetadataschemaSuccessResponse extends RestResponse {
  constructor(
    public metadataschema: MetadataSchema,
    public statusCode: number,
    public statusText: string,
  ) {
    super(true, statusCode, statusText);
  }
}

export class SearchSuccessResponse extends RestResponse {
  constructor(
    public results: SearchQueryResponse,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class FacetConfigSuccessResponse extends RestResponse {
  constructor(
    public results: SearchFilterConfig[],
    public statusCode: number,
    public statusText: string,
  ) {
    super(true, statusCode, statusText);
  }
}

export class FacetValueMap {
  [name: string]: FacetValueSuccessResponse
}

export class FacetValueSuccessResponse extends RestResponse {
  constructor(
    public results: FacetValue[],
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo) {
    super(true, statusCode, statusText);
  }
}

export class FacetValueMapSuccessResponse extends RestResponse {
  constructor(
    public results: FacetValueMap,
    public statusCode: number,
    public statusText: string
  ) {
    super(true, statusCode, statusText);
  }
}

export class EndpointMap {
  [linkPath: string]: string
}

export class EndpointMapSuccessResponse extends RestResponse {
  constructor(
    public endpointMap: EndpointMap,
    public statusCode: number,
    public statusText: string
  ) {
    super(true, statusCode, statusText);
  }
}

export class GenericSuccessResponse<T> extends RestResponse {
  constructor(
    public payload: T,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class ErrorResponse extends RestResponse {
  errorMessage: string;

  constructor(error: RequestError) {
    super(false, error.statusCode, error.statusText);
    console.error(error);
    this.errorMessage = error.message;
  }
}

export class ConfigSuccessResponse extends RestResponse {
  constructor(
    public configDefinition: ConfigObject,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class AuthStatusResponse extends RestResponse {
  public toCache = false;

  constructor(
    public response: AuthStatus,
    public statusCode: number,
    public statusText: string,
  ) {
    super(true, statusCode, statusText);
  }
}

export class IntegrationSuccessResponse extends RestResponse {
  constructor(
    public dataDefinition: PaginatedList<IntegrationModel>,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class PostPatchSuccessResponse extends RestResponse {
  constructor(
    public dataDefinition: any,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class SubmissionSuccessResponse extends RestResponse {
  constructor(
    public dataDefinition: Array<NormalizedObject | ConfigObject | string>,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class EpersonSuccessResponse extends RestResponse {
  constructor(
    public epersonDefinition: NormalizedObject[],
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

/* tslint:enable:max-classes-per-file */

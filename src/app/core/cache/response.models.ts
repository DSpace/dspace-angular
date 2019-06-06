import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { RequestError } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';
import { ConfigObject } from '../config/models/config.model';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { IntegrationModel } from '../integration/models/integration.model';
import { RegistryMetadataschemasResponse } from '../registry/registry-metadataschemas-response.model';
import { RegistryMetadatafieldsResponse } from '../registry/registry-metadatafields-response.model';
import { RegistryBitstreamformatsResponse } from '../registry/registry-bitstreamformats-response.model';
import { MetadataSchema } from '../metadata/metadataschema.model';
import { MetadataField } from '../metadata/metadatafield.model';
import { PaginatedList } from '../data/paginated-list';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NormalizedAuthStatus } from '../auth/models/normalized-auth-status.model';

/* tslint:disable:max-classes-per-file */
export class RestResponse {
  public toCache = true;
  public timeAdded: number;

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

/**
 * A successful response containing a list of MetadataSchemas wrapped in a RegistryMetadataschemasResponse
 */
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

/**
 * A successful response containing a list of MetadataFields wrapped in a RegistryMetadatafieldsResponse
 */
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

/**
 * A successful response containing a list of BitstreamFormats wrapped in a RegistryBitstreamformatsResponse
 */
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

/**
 * A successful response containing exactly one MetadataSchema
 */
export class MetadataschemaSuccessResponse extends RestResponse {
  constructor(
    public metadataschema: MetadataSchema,
    public statusCode: number,
    public statusText: string,
  ) {
    super(true, statusCode, statusText);
  }
}

/**
 * A successful response containing exactly one MetadataField
 */
export class MetadatafieldSuccessResponse extends RestResponse {
  constructor(
    public metadatafield: MetadataField,
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
    public response: NormalizedAuthStatus,
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
    public dataDefinition: Array<SubmissionObject | ConfigObject | string>,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class EpersonSuccessResponse extends RestResponse {
  constructor(
    public epersonDefinition: DSpaceObject[],
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class MessageResponse extends RestResponse {
  public toCache = false;

  constructor(
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class TaskResponse extends RestResponse {
  public toCache = false;

  constructor(
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}

export class FilteredDiscoveryQueryResponse extends RestResponse {
  constructor(
    public filterQuery: string,
    public statusCode: number,
    public statusText: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode, statusText);
  }
}
/* tslint:enable:max-classes-per-file */

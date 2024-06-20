import { Injectable } from '@angular/core';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { isEmpty } from './empty.util';
import { firstValueFrom } from 'rxjs';
import {
  DOI_METADATA_FIELD
} from '../item-page/simple/field-components/clarin-generic-item-field/clarin-generic-item-field.component';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { map } from 'rxjs/operators';

export const DEFAULT_DOI_RESOLVER = 'https://doi.org/';
export const DOI_RESOLVER_CFG_PROPERTY = 'identifier.doi.resolver';

/**
 * Service to handle the item identifier. It prettifies the identifier and removes the DOI resolver from it.
 */
@Injectable()
export class ItemIdentifierService {
  constructor(private configurationService: ConfigurationDataService) {
  }

  /**
   * Prettify the identifier. If the identifier is DOI, remove the DOI resolver from it.
   *
   * @param identifier
   * @param metadataFields
   */
  async prettifyIdentifier(identifier: string, metadataFields: string[] = []) {
    let prettifiedIdentifier = identifier;
    if (isEmpty(identifier)) {
      return prettifiedIdentifier;
    }

    // Do not prettify the identifier if it is not DOI.
    if (!metadataFields?.includes(DOI_METADATA_FIELD)) {
      return prettifiedIdentifier;
    }

    // Get the DOI resolver from the configuration.
    const cfgDoiResolver = await firstValueFrom(this.loadDoiResolverConfiguration());

    // If the configuration is not set, use the default resolver.
    const doiResolver = isEmpty(cfgDoiResolver) ? DEFAULT_DOI_RESOLVER : cfgDoiResolver;

    // Remove the DOI resolver from the identifier.
    return this.removeDoiResolverFromIdentifier(identifier, doiResolver);
  }

  /**
   * Remove the DOI resolver from the identifier.
   *
   * @param identifier
   * @param doiResolver
   */
  removeDoiResolverFromIdentifier(identifier: string, doiResolver: string) {
    return identifier.replace(doiResolver, '');
  }

  /**
   * Load the DOI resolver from the configuration. It is a `identifier.doi.resolver` property.
   */
  loadDoiResolverConfiguration() {
    return this.configurationService.findByPropertyName(DOI_RESOLVER_CFG_PROPERTY)
      .pipe(
        getFirstCompletedRemoteData(),
        map((config) => config?.payload?.values?.[0]));
  }
}

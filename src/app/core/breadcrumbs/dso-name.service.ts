import { Injectable } from '@angular/core';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';

import { DSpaceObject } from '../shared/dspace-object.model';
import { Metadata } from '../shared/metadata.utils';

/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root',
})
export class DSONameService {

  constructor(private translateService: TranslateService) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    EPerson: (dso: DSpaceObject, escapeHTML?: boolean): string => {
      const firstName = dso.firstMetadataValue('eperson.firstname', undefined, escapeHTML);
      const lastName = dso.firstMetadataValue('eperson.lastname', undefined, escapeHTML);
      if (isEmpty(firstName) && isEmpty(lastName)) {
        return this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(firstName) || isEmpty(lastName)) {
        return firstName || lastName;
      } else {
        return `${firstName} ${lastName}`;
      }
    },
    Person: (dso: DSpaceObject, escapeHTML?: boolean): string => {
      const familyName = dso.firstMetadataValue('person.familyName', undefined, escapeHTML);
      const givenName = dso.firstMetadataValue('person.givenName', undefined, escapeHTML);
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return dso.firstMetadataValue('dc.title', undefined, escapeHTML) || this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      } else {
        return `${familyName}, ${givenName}`;
      }
    },
    OrgUnit: (dso: DSpaceObject, escapeHTML?: boolean): string => {
      return dso.firstMetadataValue('organization.legalName', undefined, escapeHTML);
    },
    Default: (dso: DSpaceObject, escapeHTML?: boolean): string => {
      // If object doesn't have dc.title metadata use name property
      return dso.firstMetadataValue('dc.title', undefined, escapeHTML) || dso.name || this.translateService.instant('dso.name.untitled');
    },
  };

  private readonly languageFactories = {
    OrgUnit: (dso: DSpaceObject): string => {
      return dso.firstMetadata('organization.legalName')?.language;
    },
    Default: (dso: DSpaceObject): string => {
      return dso.firstMetadata('dc.title')?.language;
    },
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   */
  getName(dso: DSpaceObject | undefined, escapeHTML?: boolean): string {
    if (dso) {
      const types = dso.getRenderTypes();
      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.factories).includes(type)) as string;

      let name;
      if (hasValue(match)) {
        name = this.factories[match](dso, escapeHTML);
      }
      if (isEmpty(name)) {
        name = this.factories.Default(dso, escapeHTML);
      }
      return name;
    } else {
      return '';
    }
  }

  /**
   * Retrieves the language identifier associated with a DSpaceObject's primary display name.
   *
   * Uses a type-based factory pattern to determine the appropriate language extraction strategy
   * based on the object's render types. Currently, supports OrgUnit-specific language extraction,
   * with a fallback to the Default factory for all other entity types.
   *
   * @param dso The {@link DSpaceObject} from which to extract the name language. Can be undefined.
   * @returns The language code/identifier of the primary display name metadata,
   *          or undefined if the DSpaceObject is null/undefined or lacks language metadata.
   */
  getNameLanguage(dso: DSpaceObject | undefined): string {
    if (dso) {
      const types = dso.getRenderTypes();
      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.languageFactories).includes(type)) as string;

      let language: string;
      if (hasValue(match)) {
        language = this.languageFactories[match](dso);
      }
      if (isEmpty(language)) {
        language = this.languageFactories.Default(dso);
      }
      return language;
    }
  }

  /**
   * Gets the Hit highlight
   *
   * @param object
   * @param dso
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   *
   * @returns {string} html embedded hit highlight.
   */
  getHitHighlights(object: any, dso: DSpaceObject, escapeHTML?: boolean): MetadataValue {
    const types = dso.getRenderTypes();
    const entityType = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => (['Person', 'OrgUnit']).includes(type)) as string;
    if (entityType === 'Person') {
      const familyName = this.firstMetadata(object, dso, 'person.familyName', escapeHTML);
      const givenName = this.firstMetadata(object, dso, 'person.givenName', escapeHTML);
      if (isEmpty(familyName?.value) && isEmpty(givenName?.value)) {
        return this.firstMetadata(object, dso, 'dc.title', escapeHTML) ||
          (dso.name && Object.assign(new MetadataValue(), { value: dso.name })) ||
          Object.assign(new MetadataValue(), { value: this.translateService.instant('person.listelement.no-title') });
      } else if (isEmpty(familyName?.value) || isEmpty(givenName?.value)) {
        return familyName || givenName;
      }
      return Object.assign(new MetadataValue(), { value: `${familyName.value}, ${givenName.value}` });
    } else if (entityType === 'OrgUnit') {
      return this.firstMetadata(object, dso, 'organization.legalName', escapeHTML) ||
        Object.assign(new MetadataValue(), { value: this.translateService.instant('orgunit.listelement.no-title') });
    }
    return this.firstMetadata(object, dso, 'dc.title', escapeHTML) ||
      (dso.name && Object.assign(new MetadataValue(), { value: dso.name })) ||
      Object.assign(new MetadataValue(), { value: this.translateService.instant('dso.name.untitled') });
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param object
   * @param dso
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   *
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(object: any, dso: DSpaceObject, keyOrKeys: string | string[], escapeHTML?: boolean): string {
    return Metadata.firstValue(dso.metadata, keyOrKeys, object.hitHighlights, undefined, escapeHTML);
  }

  /**
   * Gets the first matching metadata from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param object
   * @param dso
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   *
   * @returns {string} the first matching metadata, or `undefined`.
   */
  firstMetadata(object: any, dso: DSpaceObject, keyOrKeys: string | string[], escapeHTML?: boolean): MetadataValue {
    return Metadata.first(dso.metadata, keyOrKeys, object.hitHighlights, undefined, escapeHTML);
  }

}

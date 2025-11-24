import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
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
    EPerson: (dso: DSpaceObject, injectedAsHTML?: boolean): string => {
      const firstName = dso.firstMetadataValue('eperson.firstname', undefined, injectedAsHTML);
      const lastName = dso.firstMetadataValue('eperson.lastname', undefined, injectedAsHTML);
      if (isEmpty(firstName) && isEmpty(lastName)) {
        return this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(firstName) || isEmpty(lastName)) {
        return firstName || lastName;
      } else {
        return `${firstName} ${lastName}`;
      }
    },
    Person: (dso: DSpaceObject, injectedAsHTML?: boolean): string => {
      const familyName = dso.firstMetadataValue('person.familyName', undefined, injectedAsHTML);
      const givenName = dso.firstMetadataValue('person.givenName', undefined, injectedAsHTML);
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return dso.firstMetadataValue('dc.title', undefined, injectedAsHTML) || this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      } else {
        return `${familyName}, ${givenName}`;
      }
    },
    OrgUnit: (dso: DSpaceObject, injectedAsHTML?: boolean): string => {
      return dso.firstMetadataValue('organization.legalName', undefined, injectedAsHTML) || this.translateService.instant('dso.name.untitled');
    },
    Default: (dso: DSpaceObject, injectedAsHTML?: boolean): string => {
      // If object doesn't have dc.title metadata use name property
      return dso.firstMetadataValue('dc.title', undefined, injectedAsHTML) || dso.name || this.translateService.instant('dso.name.untitled');
    },
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   * @param injectedAsHTML Whether the HTML is used inside a `[innerHTML]` attribute
   */
  getName(dso: DSpaceObject | undefined, injectedAsHTML?: boolean): string {
    if (dso) {
      const types = dso.getRenderTypes();
      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.factories).includes(type)) as string;

      let name;
      if (hasValue(match)) {
        name = this.factories[match](dso, injectedAsHTML);
      }
      if (isEmpty(name)) {
        name = this.factories.Default(dso, injectedAsHTML);
      }
      return name;
    } else {
      return '';
    }
  }

  /**
   * Gets the Hit highlight
   *
   * @param object
   * @param dso
   * @param injectedAsHTML Whether the HTML is used inside a `[innerHTML]` attribute
   *
   * @returns {string} html embedded hit highlight.
   */
  getHitHighlights(object: any, dso: DSpaceObject, injectedAsHTML?: boolean): string {
    const types = dso.getRenderTypes();
    const entityType = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => (['Person', 'OrgUnit']).includes(type)) as string;
    if (entityType === 'Person') {
      const familyName = this.firstMetadataValue(object, dso, 'person.familyName', injectedAsHTML);
      const givenName = this.firstMetadataValue(object, dso, 'person.givenName', injectedAsHTML);
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return this.firstMetadataValue(object, dso, 'dc.title', injectedAsHTML) || dso.name;
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      }
      return `${familyName}, ${givenName}`;
    } else if (entityType === 'OrgUnit') {
      return this.firstMetadataValue(object, dso, 'organization.legalName', injectedAsHTML) || this.translateService.instant('dso.name.untitled');
    }
    return this.firstMetadataValue(object, dso, 'dc.title', injectedAsHTML) || dso.name || this.translateService.instant('dso.name.untitled');
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param object
   * @param dso
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param injectedAsHTML Whether the HTML is used inside a `[innerHTML]` attribute
   *
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(object: any, dso: DSpaceObject, keyOrKeys: string | string[], injectedAsHTML?: boolean): string {
    return Metadata.firstValue(dso.metadata, keyOrKeys, object.hitHighlights, undefined, injectedAsHTML);
  }

}

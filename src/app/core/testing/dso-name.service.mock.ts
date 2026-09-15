import { DSpaceObject } from '../shared/dspace-object.model';
import { MetadataValue } from '../shared/metadata.models';

export const UNDEFINED_NAME = 'Undefined';

export class DSONameServiceMock {
  public getName(dso: DSpaceObject | undefined) {
    return dso?.name || UNDEFINED_NAME;
  }

  public getHitHighlights(object: any, dso: DSpaceObject): MetadataValue {
    if (object.hitHighlights && object.hitHighlights['dc.title']) {
      return Object.assign(new MetadataValue(), {
        value: object.hitHighlights['dc.title'][0].value,
      });
    } else if (object.hitHighlights && object.hitHighlights['organization.legalName']) {
      return Object.assign(new MetadataValue(), {
        value: object.hitHighlights['organization.legalName'][0].value,
      });
    } else if (object.hitHighlights && (object.hitHighlights['person.familyName'] || object.hitHighlights['person.givenName'])) {
      if (object.hitHighlights['person.familyName'] && object.hitHighlights['person.givenName']) {
        return Object.assign(new MetadataValue(), {
          value: `${object.hitHighlights['person.familyName'][0].value}, ${object.hitHighlights['person.givenName'][0].value}`,
        });
      }
      if (object.hitHighlights['person.familyName']) {
        return Object.assign(new MetadataValue(), {
          value: `${object.hitHighlights['person.familyName'][0].value}`,
        });
      }
      if (object.hitHighlights['person.givenName']) {
        return Object.assign(new MetadataValue(), {
          value: `${object.hitHighlights['person.givenName'][0].value}`,
        });
      }
    }
    return Object.assign(new MetadataValue(), {
      value: UNDEFINED_NAME,
    });
  }
}

/**
 * An interface to represent an access condition.
 */
export class SherpaPoliciesDetailsObject {

  /**
   * The sherpa policies uri
   */
  uri: string;

  /**
   * The sherpa policies details
   */
  journals: Journals;
}


export interface Journals {
  titles: string[];
  url: string;
  issns: string[];
  romeoPub: string;
  zetoPub: string;
  inDOAJ: boolean;
  publisher: Publisher;
  policies: Policies;
  urls: string[];
  openAccessProhibited: boolean;
}

export interface Publisher {
  name: string;
  relationshipType: string;
  country: string;
  uri: string;
  identifier: string;
  paidAccessDescription: string;
  paidAccessUrl: string;
}

export interface Policies {
  openAccessPermitted: boolean;
  uri: string;
  internalMoniker: string;
  permittedVersions: PermittedVersions;
}

export interface PermittedVersions {
  articleVersion: string;
  conditions: string[];
  prerequisites: string[];
  locations: string[];
  licenses: string[];
  embargo: Embargo;
}

export interface Embargo {
  units: any;
  amount: any;
}

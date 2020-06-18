import { FeatureType } from './feature-type';

export class AuthorizationSearchParams {
  objectUrl: string;
  ePersonUuid: string;
  featureId: FeatureType;

  constructor(objectUrl?: string, ePersonUuid?: string, featureId?: FeatureType) {
    this.objectUrl = objectUrl;
    this.ePersonUuid = ePersonUuid;
    this.featureId = featureId;
  }
}

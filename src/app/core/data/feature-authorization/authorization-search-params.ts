export class AuthorizationSearchParams {
  objectUrl: string;
  ePersonUuid: string;
  featureId: string;

  constructor(objectUrl?: string, ePersonUuid?: string, featureId?: string) {
    this.objectUrl = objectUrl;
    this.ePersonUuid = ePersonUuid;
    this.featureId = featureId;
  }
}

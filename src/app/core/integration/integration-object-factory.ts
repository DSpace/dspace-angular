import { GenericConstructor } from '../shared/generic-constructor';
import { IntegrationType } from './intergration-type';
import { AuthorityModel } from './models/authority.model';
import { IntegrationModel } from './models/integration.model';

export class IntegrationObjectFactory {
  public static getConstructor(type): GenericConstructor<IntegrationModel> {
    switch (type) {
      case IntegrationType.Authority: {
        return AuthorityModel;
      }
      default: {
        return undefined;
      }
    }
  }
}

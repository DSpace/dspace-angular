import { GenericConstructor } from '../shared/generic-constructor';
import { IntegrationType } from './intergration-type';
import { AuthorityValueModel } from './models/authority-value.model';
import { IntegrationModel } from './models/integration.model';

export class IntegrationObjectFactory {
  public static getConstructor(type): GenericConstructor<IntegrationModel> {
    switch (type) {
      case IntegrationType.Authority: {
        return AuthorityValueModel;
      }
      default: {
        return undefined;
      }
    }
  }
}

import { GenericConstructor } from '../shared/generic-constructor';
import { IntegrationType } from './intergration-type';
import { IntegrationModel } from './models/integration.model';
import { NormalizedAuthorityValue } from './models/normalized-authority-value.model';

export class IntegrationObjectFactory {
  public static getConstructor(type): GenericConstructor<IntegrationModel> {
    switch (type) {
      case IntegrationType.Authority: {
        return NormalizedAuthorityValue;
      }
      default: {
        return undefined;
      }
    }
  }
}

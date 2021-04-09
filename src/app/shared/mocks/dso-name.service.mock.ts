import { DSpaceObject } from '../../core/shared/dspace-object.model';

export const UNDEFINED_NAME = 'Undefined';

export class DSONameServiceMock {
  public getName(dso: DSpaceObject) {
    return UNDEFINED_NAME;
  }
}

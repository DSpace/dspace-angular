import { TypedObject } from '../../../core/cache/object-cache.reducer';
import { GenericConstructor } from '../../../core/shared/generic-constructor';

export interface ListableObject extends TypedObject {

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>>;
}

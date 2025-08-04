import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { EquatableObject } from '@dspace/core/utilities/equals.decorators';

export abstract class ListableObject extends EquatableObject<ListableObject> {
  /**
   * Method that returns as which type of object this object should be rendered
   */
  public abstract getRenderTypes(): (string | GenericConstructor<ListableObject>)[];
}

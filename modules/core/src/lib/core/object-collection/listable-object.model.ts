import { GenericConstructor } from '../shared';
import { EquatableObject } from '../utilities';

export abstract class ListableObject extends EquatableObject<ListableObject> {
  /**
   * Method that returns as which type of object this object should be rendered
   */
  public abstract getRenderTypes(): (string | GenericConstructor<ListableObject>)[];
}

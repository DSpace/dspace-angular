import { TypedObject } from '../../../core/cache/object-cache.reducer';
import { GenericConstructor } from '../../../core/shared/generic-constructor';

export interface ListableObject extends TypedObject {
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>>;
}

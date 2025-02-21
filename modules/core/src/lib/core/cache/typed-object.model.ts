import { ResourceType } from '../shared';

export abstract class TypedObject {
  static type: ResourceType;
  type: ResourceType;
}

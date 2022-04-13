import { autoserialize } from 'cerialize';
import { typedObject } from 'src/app/core/cache/builders/build-decorators';
import { ResourceType } from 'src/app/core/shared/resource-type';
import { excludeFromEquals } from 'src/app/core/utilities/equals.decorators';
import { ACCESS_STATUS } from './access-status.resource-type';

@typedObject
export class AccessStatusObject {
  static type = ACCESS_STATUS;

  /**
   * The type for this AccessStatusObject
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The access status value
   */
  @autoserialize
  status: string;
}

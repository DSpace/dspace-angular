import { PROCESS_OUTPUT_TYPE } from '../../core/shared/process-output.resource-type';
import { CacheableObject } from '../../core/cache/object-cache.reducer';
import { HALLink } from '../../core/shared/hal-link.model';
import { autoserialize, deserialize } from 'cerialize';
import { excludeFromEquals } from '../../core/utilities/equals.decorators';
import { ResourceType } from '../../core/shared/resource-type';
import { typedObject } from '../../core/cache/builders/build-decorators';

/**
 * Object representing a process output object
 */
@typedObject
export class ProcessOutput implements CacheableObject {
  static type = PROCESS_OUTPUT_TYPE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The output strings for this ProcessOutput
   */
  @autoserialize
  logs: string[];

  /**
   * The {@link HALLink}s for this ProcessOutput
   */
  @deserialize
  _links: {
    self: HALLink,
  };
}

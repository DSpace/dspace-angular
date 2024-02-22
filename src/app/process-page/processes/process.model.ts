import { Bitstream } from '../../core/shared/bitstream.model';
import { PROCESS_OUTPUT_TYPE } from '../../core/shared/process-output.resource-type';
import { ProcessStatus } from './process-status.model';
import { ProcessParameter } from './process-parameter.model';
import { HALLink } from '../../core/shared/hal-link.model';
import { autoserialize, deserialize } from 'cerialize';
import { PROCESS } from './process.resource-type';
import { excludeFromEquals } from '../../core/utilities/equals.decorators';
import { ResourceType } from '../../core/shared/resource-type';
import { link, typedObject } from '../../core/cache/builders/build-decorators';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { SCRIPT } from '../scripts/script.resource-type';
import { Script } from '../scripts/script.model';
import { CacheableObject } from '../../core/cache/cacheable-object.model';
import { BITSTREAM } from '../../core/shared/bitstream.resource-type';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Filetypes } from './filetypes.model';
import { FILETYPES } from './filetypes.resource-type';

/**
 * Object representing a process
 */
@typedObject
export class Process implements CacheableObject {
  static type = PROCESS;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier for this process
   */
  @autoserialize
  processId: string;

  /**
   * The UUID for the user that started the process
   */
  @autoserialize
  userId: string;

  /**
   * The start time for this process
   */
  @autoserialize
  startTime: string;

  /**
   * The end time for this process
   */
  @autoserialize
  endTime: string;

  /**
   * The name of the script run by this process
   */
  @autoserialize
  scriptName: string;

  /**
   * The status of this process
   */
  @autoserialize
  processStatus: ProcessStatus;

  /**
   * The parameters for this process
   */
  @autoserialize
  parameters: ProcessParameter[];

  /**
   * The {@link HALLink}s for this Process
   */
  @deserialize
  _links: {
    self: HALLink,
    script: HALLink,
    output: HALLink,
    files: HALLink,
    filetypes: HALLink,
  };

  /**
   * The Script that created this Process
   * Will be undefined unless the script {@link HALLink} has been resolved.
   */
  @link(SCRIPT)
  script?: Observable<RemoteData<Script>>;

  /**
   * The output logs created by this Process
   * Will be undefined unless the output {@link HALLink} has been resolved.
   */
  @link(PROCESS_OUTPUT_TYPE)
  output?: Observable<RemoteData<Bitstream>>;

  /**
   * The files created by this Process
   * Will be undefined unless the output {@link HALLink} has been resolved.
   */
  @link(BITSTREAM, true)
  files?: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * The filetypes present in this Process
   * Will be undefined unless the output {@link HALLink} has been resolved.
   */
  @link(FILETYPES)
  filetypes?: Observable<RemoteData<Filetypes>>;

}

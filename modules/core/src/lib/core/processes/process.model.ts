import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  CacheableObject,
  link,
  typedObject,
} from '../cache';
import {
  PaginatedList,
  RemoteData,
} from '../data';
import {
  SCRIPT,
  Script,
} from '../scripts';
import {
  BITSTREAM,
  Bitstream,
  HALLink,
  PROCESS_OUTPUT_TYPE,
  ResourceType,
} from '../shared';
import { excludeFromEquals } from '../utilities';
import { Filetypes } from './filetypes.model';
import { FILETYPES } from './filetypes.resource-type';
import { PROCESS } from './process.resource-type';
import { ProcessParameter } from './process-parameter.model';
import { ProcessStatus } from './process-status.model';

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
  @autoserializeAs(String)
  processId: string;

  /**
   * The UUID for the user that started the process
   */
  @autoserialize
  userId: string;

  /**
   * The creation time for this process
   */
  @autoserialize
  creationTime: string;

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

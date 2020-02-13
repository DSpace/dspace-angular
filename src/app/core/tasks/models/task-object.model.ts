import { Observable } from 'rxjs';
import { link, resourceType } from '../../cache/builders/build-decorators';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { RemoteData } from '../../data/remote-data';
import { EPerson } from '../../eperson/models/eperson.model';
import { EPERSON } from '../../eperson/models/eperson.resource-type';
import { Group } from '../../eperson/models/group.model';
import { GROUP } from '../../eperson/models/group.resource-type';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { WorkflowItem } from '../../submission/models/workflowitem.model';
import { TASK_OBJECT } from './task-object.resource-type';

/**
 * An abstract model class for a TaskObject.
 */
@resourceType(TaskObject.type)
export class TaskObject extends DSpaceObject implements CacheableObject {
  static type = TASK_OBJECT;

  /**
   * The task identifier
   */
  id: string;

  /**
   * The workflow step
   */
  step: string;

  /**
   * The task action type
   */
  action: string;

  /**
   * The EPerson for this task
   * Will be undefined unless the eperson HALLink has been resolved.
   */
  @link(EPERSON)
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The Group for this task
   * Will be undefined unless the group HALLink has been resolved.
   */
  @link(GROUP)
  group?: Observable<RemoteData<Group>>;

  /**
   * The WorkflowItem for this task
   * Will be undefined unless the workflowitem HALLink has been resolved.
   */
  @link(WorkflowItem.type)
  workflowitem?: Observable<RemoteData<WorkflowItem>> | WorkflowItem;

  _links: {
    self: HALLink,
    eperson: HALLink,
    group: HALLink,
    workflowitem: HALLink,
  }

}

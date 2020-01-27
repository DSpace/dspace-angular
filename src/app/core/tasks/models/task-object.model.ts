import { Observable } from 'rxjs';
import { link } from '../../cache/builders/build-decorators';

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
   * The group of this task
   */
  @link(EPERSON)
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The group of this task
   */
  @link(GROUP)
  group?: Observable<RemoteData<Group>>;

  /**
   * The workflowitem object whom this task is related
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

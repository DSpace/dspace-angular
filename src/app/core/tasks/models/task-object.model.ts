import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../../cache/builders/build-decorators';

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
import { WORKFLOWITEM } from '../../eperson/models/workflowitem.resource-type';

/**
 * An abstract model class for a TaskObject.
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class TaskObject extends DSpaceObject implements CacheableObject {
  static type = TASK_OBJECT;

  /**
   * The task identifier
   */
  @autoserialize
  id: string;

  /**
   * The workflow step
   */
  @autoserialize
  step: string;

  /**
   * The task action type
   */
  @autoserialize
  action: string;

  /**
   * The {@link HALLink}s for this TaskObject
   */
  @deserialize
  _links: {
    self: HALLink;
    owner: HALLink;
    group: HALLink;
    workflowitem: HALLink;
  };

  /**
   * The EPerson for this task
   * Will be undefined unless the eperson {@link HALLink} has been resolved.
   */
  @link(EPERSON, false, 'owner')
  eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The Group for this task
   * Will be undefined unless the group {@link HALLink} has been resolved.
   */
  @link(GROUP)
  group?: Observable<RemoteData<Group>>;

  /**
   * The WorkflowItem for this task
   * Will be undefined unless the workflowitem {@link HALLink} has been resolved.
   */
  @link(WORKFLOWITEM)
  workflowitem?: Observable<RemoteData<WorkflowItem>> | WorkflowItem;

}

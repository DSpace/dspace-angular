import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache';
import { CacheableObject } from '../../cache';
import { RemoteData } from '../../data';
import { EPerson } from '../../eperson';
import { EPERSON } from '../../eperson';
import { Group } from '../../eperson';
import { GROUP } from '../../eperson';
import { WORKFLOWITEM } from '../../eperson';
import { DSpaceObject } from '../../shared';
import { HALLink } from '../../shared';
import { TASK_OBJECT } from './task-object.resource-type';
import { WorkflowAction } from './workflow-action-object.model';
import { WORKFLOW_ACTION } from './workflow-action-object.resource-type';

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
   * The {@link HALLink}s for this TaskObject
   */
  @deserialize
  _links: {
    self: HALLink;
    owner: HALLink;
    group: HALLink;
    workflowitem: HALLink;
    action: HALLink;
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
  /* This was changed from 'WorkflowItem | Observable<RemoteData<WorkflowItem>>' to 'any' to prevent issues in templates with async */
    workflowitem?: any;

  /**
   * The task action type
   * Will be undefined unless the group {@link HALLink} has been resolved.
   */
  @link(WORKFLOW_ACTION, false, 'action')
  action: Observable<RemoteData<WorkflowAction>>;

}

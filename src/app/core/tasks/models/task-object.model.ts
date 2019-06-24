import { Observable } from 'rxjs';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { RemoteData } from '../../data/remote-data';
import { WorkflowItem } from '../../submission/models/workflowitem.model';
import { Group } from '../../eperson/models/group.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * An abstract model class for a TaskObject.
 */
export class TaskObject extends DSpaceObject implements CacheableObject, ListableObject {
  static type = new ResourceType('taskobject');

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
  eperson: Observable<RemoteData<EPerson>>;

  /**
   * The group of this task
   */
  group: Observable<RemoteData<Group>>;

  /**
   * The workflowitem object whom this task is related
   */
  workflowitem: Observable<RemoteData<WorkflowItem>> | WorkflowItem;
}

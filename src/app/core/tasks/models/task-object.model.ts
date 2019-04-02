import { Observable } from 'rxjs';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { RemoteData } from '../../data/remote-data';
import { Workflowitem } from '../../submission/models/workflowitem.model';

/**
 * An abstract model class for a TaskObject.
 */
export class TaskObject extends DSpaceObject implements CacheableObject, ListableObject {

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
   * The workflowitem object whom this task is related
   */
  workflowitem: Observable<RemoteData<Workflowitem>> | Workflowitem;
}

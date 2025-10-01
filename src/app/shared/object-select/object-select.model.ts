import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Observable } from 'rxjs';

/**
 * Class used to collect all the data that that is used by the {@link ObjectSelectComponent} in the HTML.
 */
export class DSpaceObjectSelect<T extends DSpaceObject> {

  /**
   * The {@link DSpaceObject} to display
   */
  dso: T;

  /**
   * Whether the {@link DSpaceObject} can be selected
   */
  canSelect$: Observable<boolean>;

  /**
   * Whether the {@link DSpaceObject} is selected
   */
  selected$: Observable<boolean>;

  /**
   * The {@link DSpaceObject}'s route
   */
  route: string;

}

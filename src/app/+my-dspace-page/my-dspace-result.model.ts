import { Metadatum } from '../core/shared/metadatum.model';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';
import { SubmissionObject } from '../core/submission/models/submission-object.model';

export class MyDSpaceResult<T extends SubmissionObject> implements ListableObject {

  dspaceObject: T;
  hitHighlights: Metadatum[];

}

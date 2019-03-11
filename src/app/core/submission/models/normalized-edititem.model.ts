import { inheritSerialization } from 'cerialize';
import { mapsTo } from '../../cache/builders/build-decorators';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { EditItem } from './edititem.model';

@mapsTo(EditItem)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedEditItem extends NormalizedSubmissionObject<EditItem> {

}

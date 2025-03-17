import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Vocabulary } from '../../core/submission/vocabularies/models/vocabulary.model';

/**
 * Stub class of {@link DsoEditMetadataFieldService}
 */
export class DsoEditMetadataFieldServiceStub {

  findDsoFieldVocabulary(_dso: DSpaceObject, _mdField: string): Observable<Vocabulary> {
    return observableOf(undefined);
  }

}

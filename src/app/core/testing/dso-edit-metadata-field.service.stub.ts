import {
  Observable,
  of,
} from 'rxjs';

import { DSpaceObject } from '../shared/dspace-object.model';
import { Vocabulary } from '../submission/vocabularies/models/vocabulary.model';

/**
 * Stub class of {@link DsoEditMetadataFieldService}
 */
export class DsoEditMetadataFieldServiceStub {

  findDsoFieldVocabulary(_dso: DSpaceObject, _mdField: string): Observable<Vocabulary> {
    return of(undefined);
  }

}

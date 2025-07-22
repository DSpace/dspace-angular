import { DSpaceObject } from '@core/shared/dspace-object.model';
import { Vocabulary } from '@core/submission/vocabularies/models/vocabulary.model';
import {
  Observable,
  of,
} from 'rxjs';

/**
 * Stub class of {@link DsoEditMetadataFieldService}
 */
export class DsoEditMetadataFieldServiceStub {

  findDsoFieldVocabulary(_dso: DSpaceObject, _mdField: string): Observable<Vocabulary> {
    return of(undefined);
  }

}

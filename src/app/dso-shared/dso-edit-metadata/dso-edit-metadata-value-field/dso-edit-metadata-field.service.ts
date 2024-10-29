import { Injectable } from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ItemDataService } from '../../../core/data/item-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { Vocabulary } from '../../../core/submission/vocabularies/models/vocabulary.model';
import { VocabularyService } from '../../../core/submission/vocabularies/vocabulary.service';
import { isNotEmpty } from '../../../shared/empty.util';
import { followLink } from '../../../shared/utils/follow-link-config.model';

@Injectable({
  providedIn: 'root',
})
export class DsoEditMetadataFieldService {

  constructor(
    protected itemService: ItemDataService,
    protected vocabularyService: VocabularyService,
  ) {
  }

  /**
   * Find the vocabulary of the given {@link mdField} for the given item.
   *
   * @param dso The item
   * @param mdField The metadata field
   */
  findDsoFieldVocabulary(dso: DSpaceObject, mdField: string): Observable<Vocabulary> {
    if (isNotEmpty(mdField)) {
      const owningCollection$: Observable<Collection> = this.itemService.findByHref(dso._links.self.href, true, true, followLink('owningCollection')).pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((item: Item) => item.owningCollection),
        getFirstSucceededRemoteDataPayload(),
      );

      return owningCollection$.pipe(
        switchMap((c: Collection) => this.vocabularyService.getVocabularyByMetadataAndCollection(mdField, c.uuid).pipe(
          getFirstSucceededRemoteDataPayload(),
        )),
      );
    } else {
      return observableOf(undefined);
    }
  }
}

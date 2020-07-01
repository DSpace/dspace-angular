import { Injectable } from '@angular/core';

import { ObjectCacheService } from '../../cache/object-cache.service';
import { VocabularyEntry } from './models/vocabulary-entry.model';
import { EntriesResponseParsingService } from '../../data/entries-response-parsing.service';
import { GenericConstructor } from '../../shared/generic-constructor';

/**
 * A service responsible for parsing data for a vocabulary entries response
 */
@Injectable()
export class VocabularyEntriesResponseParsingService extends EntriesResponseParsingService<VocabularyEntry> {

  protected toCache = false;

  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super(objectCache);
  }

  getSerializerModel(): GenericConstructor<VocabularyEntry> {
    return VocabularyEntry;
  }

}

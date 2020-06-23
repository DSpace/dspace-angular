import { Injectable } from '@angular/core';

import { ObjectCacheService } from '../../cache/object-cache.service';
import { BrowseEntriesResponseParsingService } from '../../data/browse-entries-response-parsing.service';

/**
 * A service responsible for parsing data for a vocabulary entries response
 */
@Injectable()
export class VocabularyEntriesResponseParsingService extends BrowseEntriesResponseParsingService {

  protected toCache = false;

  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super(objectCache);
  }

}

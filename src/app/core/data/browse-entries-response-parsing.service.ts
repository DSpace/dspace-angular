import { Injectable } from '@angular/core';
import { ObjectCacheService } from '../cache/object-cache.service';
import { BrowseEntry } from '../shared/browse-entry.model';
import { EntriesResponseParsingService } from './entries-response-parsing.service';
import { GenericConstructor } from '../shared/generic-constructor';

@Injectable()
export class BrowseEntriesResponseParsingService extends EntriesResponseParsingService<BrowseEntry> {

  protected toCache = false;

  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super(objectCache);
  }

  getSerializerModel(): GenericConstructor<BrowseEntry> {
    return BrowseEntry;
  }

}

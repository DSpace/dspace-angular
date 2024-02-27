import { Observable } from 'rxjs';
import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { HALLink } from '../../../shared/hal-link.model';
import { VOCABULARY_ENTRY_DETAIL } from './vocabularies.resource-type';
import { link, typedObject } from '../../../cache/builders/build-decorators';
import { VocabularyEntry } from './vocabulary-entry.model';
import { RemoteData } from '../../../data/remote-data';
import { PaginatedList } from '../../../data/paginated-list.model';

/**
 * Model class for a VocabularyEntryDetail
 */
@typedObject
@inheritSerialization(VocabularyEntry)
export class VocabularyEntryDetail extends VocabularyEntry {
  static type = VOCABULARY_ENTRY_DETAIL;

  /**
   * The unique id of the entry
   */
  @autoserialize
  id: string;

  /**
   * In an hierarchical vocabulary representing if entry is selectable as value
   */
  @autoserialize
  selectable: boolean;

  /**
   * The {@link HALLink}s for this ExternalSourceEntry
   */
  @deserialize
  _links: {
    self: HALLink;
    vocabulary: HALLink;
    parent: HALLink;
    children: HALLink;
  };

  /**
   * The submitter for this SubmissionObject
   * Will be undefined unless the submitter {@link HALLink} has been resolved.
   */
  @link(VOCABULARY_ENTRY_DETAIL)
  parent?: Observable<RemoteData<VocabularyEntryDetail>>;

  /**
   * The submitter for this SubmissionObject
   * Will be undefined unless the submitter {@link HALLink} has been resolved.
   */
  @link(VOCABULARY_ENTRY_DETAIL, true)
  children?: Observable<RemoteData<PaginatedList<VocabularyEntryDetail>>>;

}

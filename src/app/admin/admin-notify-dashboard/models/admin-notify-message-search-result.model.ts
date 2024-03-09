import { SearchResult } from '../../../shared/search/models/search-result.model';
import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { AdminNotifyMessage } from './admin-notify-message.model';

@searchResultFor(AdminNotifyMessage)
export class AdminNotifySearchResult extends SearchResult<AdminNotifyMessage> {
}

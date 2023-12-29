import { AdminNotifyMessage } from './admin-notify-message.model';
import { searchResultFor } from '../../../shared/search/search-result-element-decorator';
import { SearchResult } from '../../../shared/search/models/search-result.model';


@searchResultFor(AdminNotifyMessage)
export class AdminNotifySearchResult extends SearchResult<AdminNotifyMessage> {
}

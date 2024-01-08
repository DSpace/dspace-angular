import {Injectable} from '@angular/core';
import {dataService} from '../../../core/data/base/data-service.decorator';
import {IdentifiableDataService} from '../../../core/data/base/identifiable-data.service';
import {FindAllData, FindAllDataImpl} from '../../../core/data/base/find-all-data';
import {DeleteData, DeleteDataImpl} from '../../../core/data/base/delete-data';
import {RequestService} from '../../../core/data/request.service';
import {RemoteDataBuildService} from '../../../core/cache/builders/remote-data-build.service';
import {ObjectCacheService} from '../../../core/cache/object-cache.service';
import {HALEndpointService} from '../../../core/shared/hal-endpoint.service';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {FindListOptions} from '../../../core/data/find-list-options.model';
import {FollowLinkConfig} from '../../../shared/utils/follow-link-config.model';
import {Observable} from 'rxjs';
import {RemoteData} from '../../../core/data/remote-data';
import {PaginatedList} from '../../../core/data/paginated-list.model';
import {NoContent} from '../../../core/shared/NoContent.model';
import {PatchData, PatchDataImpl} from '../../../core/data/base/patch-data';
import {ChangeAnalyzer} from '../../../core/data/change-analyzer';
import {Operation} from 'fast-json-patch';
import {RestRequestMethod} from '../../../core/data/rest-request-method';
import {CreateData, CreateDataImpl} from '../../../core/data/base/create-data';
import {SearchDataImpl} from '../../../core/data/base/search-data';
import { ADMIN_NOTIFY_MESSAGE } from "../models/admin-notify-message.resource-type";
import { AdminNotifyMessage } from "../models/admin-notify-message.model";

/**
 * Injectable service responsible for fetching/sending data from/to the REST API on the messages endpoint.
 *
 * @export
 * @class AdminNotifyMessagesService
 * @extends {IdentifiableDataService<AdminNotifyMessage>}
 */
@Injectable()
@dataService(ADMIN_NOTIFY_MESSAGE)
export class AdminNotifyMessagesService extends IdentifiableDataService<AdminNotifyMessage> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('messages', requestService, rdbService, objectCache, halService);
  }
}

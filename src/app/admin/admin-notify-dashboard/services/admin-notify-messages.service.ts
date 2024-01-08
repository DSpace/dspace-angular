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
import { BehaviorSubject, from, Observable, of, scan } from 'rxjs';
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
import { AdminNotifyMessage, QueueStatusMap } from "../models/admin-notify-message.model";
import { SearchResult } from "../../../shared/search/models/search-result.model";
import { map, mergeMap } from "rxjs/operators";
import { getAllSucceededRemoteDataPayload } from "../../../core/shared/operators";
import { AdminNotifySearchResult } from "../models/admin-notify-message-search-result.model";
import { LdnServicesService } from "../../admin-ldn-services/ldn-services-data/ldn-services-data.service";
import { ItemDataService } from "../../../core/data/item-data.service";

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
    private ldnServicesService: LdnServicesService,
    private itemDataService: ItemDataService,
  ) {
    super('messages', requestService, rdbService, objectCache, halService);
  }

  /**
   * Map labels to readable info for user
   * @param message the message to which map the labels
   */
  public formatMessageLabels(message: AdminNotifyMessage) : AdminNotifyMessage {
    message.coarNotifyType = message.coarNotifyType?.split(':')[1];
    message.queueStatusLabel = QueueStatusMap[message.queueStatusLabel];
    return message;
  }

  /**
   * Add detailed information to each message
   * @param messages the messages to which add detailded info
   */
  public getDetailedMessages(messages: AdminNotifyMessage[]) : Observable<AdminNotifyMessage[]> {
    return from(messages.map(message => this.formatMessageLabels(message))).pipe(
      mergeMap(message =>
        message.target ? this.ldnServicesService.findById(message.target.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, target: detail.name}))
        ) : of(message),
      ),
      mergeMap(message =>
        message.object ? this.itemDataService.findById(message.object.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, object: detail.name}))
        ) : of(message),
      ),
      mergeMap(message =>
        message.origin ? this.ldnServicesService.findById(message.origin.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, origin: detail.name}))
        ) : of(message),
      ),
      mergeMap(message =>
        message.context ? this.itemDataService.findById(message.context.toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({...message, context: detail.name}))
        ) : of(message),
      ),
      scan((acc: any, value: any) => [...acc, value], []),
    )
  }

  /**
   * Reprocess message in status QUEUE_STATUS_QUEUED_FOR_RETRY and update results
   * @param message the message to reprocess
   * @param messageSubject the current visualised messages source
   */
  public reprocessMessage(message: AdminNotifyMessage, messageSubject: BehaviorSubject<AdminNotifyMessage[]>) : Observable<AdminNotifyMessage[]> {
    return this.findById(message.id).pipe(
      getAllSucceededRemoteDataPayload(),
      map(reprocessedMessage => this.formatMessageLabels(reprocessedMessage)),
      mergeMap((newMessage) =>  messageSubject.pipe(
        map(messages => {
          const messageToUpdate = messages.find(currentMessage => currentMessage.id === message.id);
          const indexOfMessageToUpdate = messages.indexOf(messageToUpdate);
          newMessage.target = messageToUpdate.target;
          newMessage.object = messageToUpdate.object;
          newMessage.origin = messageToUpdate.origin;
          newMessage.context = messageToUpdate.context;
          messages[indexOfMessageToUpdate] = newMessage;
          return messages
        })
      )),
    )
  }
}

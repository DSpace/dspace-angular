import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  scan,
} from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';


import { IdentifiableDataService, ItemDataService, PostRequest, RequestService, RestRequest } from '../../data';
import { ObjectCacheService, RemoteDataBuildService } from '../../cache';
import { getAllSucceededRemoteDataPayload, getFirstCompletedRemoteData, HALEndpointService } from '../../shared';
import { NotificationsService } from '../../notifications';
import { AdminNotifyMessage } from './models/admin-notify-message.model';
import { LdnServicesService } from '../ldn-services-data';

/**
 * Injectable service responsible for fetching/sending data from/to the REST API on the messages' endpoint.
 *
 * @export
 * @class AdminNotifyMessagesService
 * @extends {IdentifiableDataService<AdminNotifyMessage>}
 */
@Injectable({ providedIn: 'root' })
export class AdminNotifyMessagesService extends IdentifiableDataService<AdminNotifyMessage> {

  protected reprocessEndpoint = 'enqueueretry';

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
   * Add detailed information to each message
   * @param messages the messages to which add detailded info
   */
  public getDetailedMessages(messages: AdminNotifyMessage[]): Observable<AdminNotifyMessage[]> {
    return from(messages).pipe(
      mergeMap(message =>
        message.target || message.origin ? this.ldnServicesService.findById((message.target || message.origin).toString()).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({ ...message, ldnService: detail.name })),
        ) : of(message),
      ),
      mergeMap(message =>
        message.object || message.context  ? this.itemDataService.findById(message.object || message.context).pipe(
          getAllSucceededRemoteDataPayload(),
          map(detail => ({ ...message, relatedItem: detail.name })),
        ) : of(message),
      ),
      scan((acc: any, value: any) => [...acc, value], []),
    );
  }

  /**
   * Reprocess message in status QUEUE_STATUS_QUEUED_FOR_RETRY and update results
   * @param message the message to reprocess
   * @param messageSubject the current visualised messages source
   */
  public reprocessMessage(message: AdminNotifyMessage, messageSubject: BehaviorSubject<AdminNotifyMessage[]>): Observable<AdminNotifyMessage[]> {
    const requestId = this.requestService.generateRequestId();

    return this.halService.getEndpoint(this.reprocessEndpoint).pipe(
      map(endpoint => endpoint.replace('{id}', message.id)),
      map((endpointURL: string) => new PostRequest(requestId, endpointURL)),
      tap(request => this.requestService.send(request)),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID<AdminNotifyMessage>(request.uuid)),
      getFirstCompletedRemoteData(),
      getAllSucceededRemoteDataPayload(),
      mergeMap(reprocessedMessage => this.getDetailedMessages([reprocessedMessage])),
    ).pipe(
      mergeMap((newMessages) =>  messageSubject.pipe(
        map(messages => {
          const detailedReprocessedMessage = newMessages[0];
          const messageToUpdate = messages.find(currentMessage => currentMessage.id === message.id);
          const indexOfMessageToUpdate = messages.indexOf(messageToUpdate);
          detailedReprocessedMessage.target = message.target;
          detailedReprocessedMessage.object = message.object;
          detailedReprocessedMessage.origin = message.origin;
          detailedReprocessedMessage.context = message.context;
          messages[indexOfMessageToUpdate] = detailedReprocessedMessage;

          return messages;
        }),
      )),
    );
  }
}

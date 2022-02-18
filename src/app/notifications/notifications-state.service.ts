import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getNotificationsBrokerTopicsCurrentPageSelector,
  getNotificationsBrokerTopicsTotalPagesSelector,
  getNotificationsBrokerTopicsTotalsSelector,
  isNotificationsBrokerTopicsLoadedSelector,
  notificationsBrokerTopicsObjectSelector,
  isNotificationsBrokerTopicsProcessingSelector
} from './selectors';
import { NotificationsBrokerTopicObject } from '../core/notifications/broker/models/notifications-broker-topic.model';
import { NotificationsState } from './notifications.reducer';
import { RetrieveAllTopicsAction } from './broker/topics/notifications-broker-topics.actions';

/**
 * The service handling the Notifications State.
 */
@Injectable()
export class NotificationsStateService {

  /**
   * Initialize the service variables.
   * @param {Store<NotificationsState>} store
   */
  constructor(private store: Store<NotificationsState>) { }

  // Notifications Broker topics
  // --------------------------------------------------------------------------

  /**
   * Returns the list of Notifications Broker topics from the state.
   *
   * @return Observable<NotificationsBrokerTopicObject>
   *    The list of Notifications Broker topics.
   */
  public getNotificationsBrokerTopics(): Observable<NotificationsBrokerTopicObject[]> {
    return this.store.pipe(select(notificationsBrokerTopicsObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Notifications Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isNotificationsBrokerTopicsLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isNotificationsBrokerTopicsLoadedSelector),
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Returns the information about the loading status of the Notifications Broker topics (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loaded, 'false' otherwise.
   */
  public isNotificationsBrokerTopicsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isNotificationsBrokerTopicsLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Notifications Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isNotificationsBrokerTopicsProcessing(): Observable<boolean> {
    return this.store.pipe(select(isNotificationsBrokerTopicsProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Notifications Broker topics.
   *
   * @return Observable<number>
   *    The number of the Notifications Broker topics pages.
   */
  public getNotificationsBrokerTopicsTotalPages(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerTopicsTotalPagesSelector));
  }

  /**
   * Returns the current page of the Notifications Broker topics, from the state.
   *
   * @return Observable<number>
   *    The number of the current Notifications Broker topics page.
   */
  public getNotificationsBrokerTopicsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerTopicsCurrentPageSelector));
  }

  /**
   * Returns the total number of the Notifications Broker topics.
   *
   * @return Observable<number>
   *    The number of the Notifications Broker topics.
   */
  public getNotificationsBrokerTopicsTotals(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerTopicsTotalsSelector));
  }

  /**
   * Dispatch a request to change the Notifications Broker topics state, retrieving the topics from the server.
   *
   * @param elementsPerPage
   *    The number of the topics per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveNotificationsBrokerTopics(elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveAllTopicsAction(elementsPerPage, currentPage));
  }
}

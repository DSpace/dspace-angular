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
  isNotificationsBrokerTopicsProcessingSelector,
  notificationsBrokerSourceObjectSelector,
  isNotificationsBrokerSourceLoadedSelector,
  isNotificationsBrokerSourceProcessingSelector,
  getNotificationsBrokerSourceTotalPagesSelector,
  getNotificationsBrokerSourceCurrentPageSelector,
  getNotificationsBrokerSourceTotalsSelector
} from './selectors';
import { NotificationsBrokerTopicObject } from '../core/notifications/broker/models/notifications-broker-topic.model';
import { NotificationsState } from './notifications.reducer';
import { RetrieveAllTopicsAction } from './broker/topics/notifications-broker-topics.actions';
import { NotificationsBrokerSourceObject } from '../core/notifications/broker/models/notifications-broker-source.model';
import { RetrieveAllSourceAction } from './broker/source/notifications-broker-source.actions';

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

  // Notifications Broker source
  // --------------------------------------------------------------------------

  /**
   * Returns the list of Notifications Broker source from the state.
   *
   * @return Observable<NotificationsBrokerSourceObject>
   *    The list of Notifications Broker source.
   */
   public getNotificationsBrokerSource(): Observable<NotificationsBrokerSourceObject[]> {
    return this.store.pipe(select(notificationsBrokerSourceObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Notifications Broker source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the source are loading, 'false' otherwise.
   */
  public isNotificationsBrokerSourceLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isNotificationsBrokerSourceLoadedSelector),
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Returns the information about the loading status of the Notifications Broker source (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the source are loaded, 'false' otherwise.
   */
  public isNotificationsBrokerSourceLoaded(): Observable<boolean> {
    return this.store.pipe(select(isNotificationsBrokerSourceLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Notifications Broker source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the source (ex.: a REST call), 'false' otherwise.
   */
  public isNotificationsBrokerSourceProcessing(): Observable<boolean> {
    return this.store.pipe(select(isNotificationsBrokerSourceProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Notifications Broker source.
   *
   * @return Observable<number>
   *    The number of the Notifications Broker source pages.
   */
  public getNotificationsBrokerSourceTotalPages(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerSourceTotalPagesSelector));
  }

  /**
   * Returns the current page of the Notifications Broker source, from the state.
   *
   * @return Observable<number>
   *    The number of the current Notifications Broker source page.
   */
  public getNotificationsBrokerSourceCurrentPage(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerSourceCurrentPageSelector));
  }

  /**
   * Returns the total number of the Notifications Broker source.
   *
   * @return Observable<number>
   *    The number of the Notifications Broker source.
   */
  public getNotificationsBrokerSourceTotals(): Observable<number> {
    return this.store.pipe(select(getNotificationsBrokerSourceTotalsSelector));
  }

  /**
   * Dispatch a request to change the Notifications Broker source state, retrieving the source from the server.
   *
   * @param elementsPerPage
   *    The number of the source per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveNotificationsBrokerSource(elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveAllSourceAction(elementsPerPage, currentPage));
  }
}

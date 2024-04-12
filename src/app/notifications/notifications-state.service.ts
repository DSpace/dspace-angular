import { Injectable } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QualityAssuranceSourceObject } from '../core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceTopicObject } from '../core/notifications/qa/models/quality-assurance-topic.model';
import { SuggestionNotificationsState } from './notifications.reducer';
import { RetrieveAllSourceAction } from './qa/source/quality-assurance-source.actions';
import { RetrieveAllTopicsAction } from './qa/topics/quality-assurance-topics.actions';
import {
  getQualityAssuranceSourceCurrentPageSelector,
  getQualityAssuranceSourceTotalPagesSelector,
  getQualityAssuranceSourceTotalsSelector,
  getQualityAssuranceTopicsCurrentPageSelector,
  getQualityAssuranceTopicsTotalPagesSelector,
  getQualityAssuranceTopicsTotalsSelector,
  isQualityAssuranceSourceLoadedSelector,
  isQualityAssuranceSourceProcessingSelector,
  isQualityAssuranceTopicsLoadedSelector,
  isQualityAssuranceTopicsProcessingSelector,
  qualityAssuranceSourceObjectSelector,
  qualityAssuranceTopicsObjectSelector,
} from './selectors';

/**
 * The service handling the Notifications State.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsStateService {

  /**
   * Initialize the service variables.
   * @param {Store<SuggestionNotificationsState>} store
   */
  constructor(private store: Store<SuggestionNotificationsState>) { }

  // Quality Assurance topics
  // --------------------------------------------------------------------------

  /**
   * Returns the list of Quality Assurance topics from the state.
   *
   * @return Observable<QualityAssuranceTopicObject>
   *    The list of Quality Assurance topics.
   */
  public getQualityAssuranceTopics(): Observable<QualityAssuranceTopicObject[]> {
    return this.store.pipe(select(qualityAssuranceTopicsObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Quality Assurance topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isQualityAssuranceTopicsLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isQualityAssuranceTopicsLoadedSelector),
      map((loaded: boolean) => !loaded),
    );
  }

  /**
   * Returns the information about the loading status of the Quality Assurance topics (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loaded, 'false' otherwise.
   */
  public isQualityAssuranceTopicsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isQualityAssuranceTopicsLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Quality Assurance topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isQualityAssuranceTopicsProcessing(): Observable<boolean> {
    return this.store.pipe(select(isQualityAssuranceTopicsProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Quality Assurance topics.
   *
   * @return Observable<number>
   *    The number of the Quality Assurance topics pages.
   */
  public getQualityAssuranceTopicsTotalPages(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceTopicsTotalPagesSelector));
  }

  /**
   * Returns the current page of the Quality Assurance topics, from the state.
   *
   * @return Observable<number>
   *    The number of the current Quality Assurance topics page.
   */
  public getQualityAssuranceTopicsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceTopicsCurrentPageSelector));
  }

  /**
   * Returns the total number of the Quality Assurance topics.
   *
   * @return Observable<number>
   *    The number of the Quality Assurance topics.
   */
  public getQualityAssuranceTopicsTotals(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceTopicsTotalsSelector));
  }

  /**
   * Dispatch a request to change the Quality Assurance topics state, retrieving the topics from the server.
   *
   * @param elementsPerPage
   *    The number of the topics per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveQualityAssuranceTopics(elementsPerPage: number, currentPage: number, sourceId: string, targteId?: string): void {
    this.store.dispatch(new RetrieveAllTopicsAction(elementsPerPage, currentPage, sourceId, targteId));
  }

  // Quality Assurance source
  // --------------------------------------------------------------------------

  /**
   * Returns the list of Quality Assurance source from the state.
   *
   * @return Observable<QualityAssuranceSourceObject>
   *    The list of Quality Assurance source.
   */
  public getQualityAssuranceSource(): Observable<QualityAssuranceSourceObject[]> {
    return this.store.pipe(select(qualityAssuranceSourceObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the Quality Assurance source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the source are loading, 'false' otherwise.
   */
  public isQualityAssuranceSourceLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isQualityAssuranceSourceLoadedSelector),
      map((loaded: boolean) => !loaded),
    );
  }

  /**
   * Returns the information about the loading status of the Quality Assurance source (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the source are loaded, 'false' otherwise.
   */
  public isQualityAssuranceSourceLoaded(): Observable<boolean> {
    return this.store.pipe(select(isQualityAssuranceSourceLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the Quality Assurance source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the source (ex.: a REST call), 'false' otherwise.
   */
  public isQualityAssuranceSourceProcessing(): Observable<boolean> {
    return this.store.pipe(select(isQualityAssuranceSourceProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the Quality Assurance source.
   *
   * @return Observable<number>
   *    The number of the Quality Assurance source pages.
   */
  public getQualityAssuranceSourceTotalPages(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceSourceTotalPagesSelector));
  }

  /**
   * Returns the current page of the Quality Assurance source, from the state.
   *
   * @return Observable<number>
   *    The number of the current Quality Assurance source page.
   */
  public getQualityAssuranceSourceCurrentPage(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceSourceCurrentPageSelector));
  }

  /**
   * Returns the total number of the Quality Assurance source.
   *
   * @return Observable<number>
   *    The number of the Quality Assurance source.
   */
  public getQualityAssuranceSourceTotals(): Observable<number> {
    return this.store.pipe(select(getQualityAssuranceSourceTotalsSelector));
  }

  /**
   * Dispatch a request to change the Quality Assurance source state, retrieving the source from the server.
   *
   * @param elementsPerPage
   *    The number of the source per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveQualityAssuranceSource(elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveAllSourceAction(elementsPerPage, currentPage));
  }
}

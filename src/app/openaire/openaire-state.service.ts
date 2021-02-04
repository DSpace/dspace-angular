import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getOpenaireBrokerTopicsCurrentPageSelector,
  getOpenaireBrokerTopicsTotalPagesSelector,
  getOpenaireBrokerTopicsTotalsSelector,
  isOpenaireBrokerTopicsLoadedSelector,
  openaireBrokerTopicsObjectSelector,
  sOpenaireBrokerTopicsProcessingSelector
} from './selectors';
import { OpenaireBrokerTopicObject } from '../core/openaire/broker/models/openaire-broker-topic.model';
import { OpenaireState } from './openaire.reducer';
import { RetrieveAllTopicsAction } from './broker/topics/openaire-broker-topics.actions';

/**
 * The service handling the OpenAIRE State.
 */
@Injectable()
export class OpenaireStateService {

  /**
   * Initialize the service variables.
   * @param {Store<OpenaireState>} store
   */
  constructor(private store: Store<OpenaireState>) { }

  // OpenAIRE Broker topics
  // --------------------------------------------------------------------------

  /**
   * Returns the list of OpenAIRE Broker topics from the state.
   *
   * @return Observable<OpenaireBrokerTopicObject>
   *    The list of OpenAIRE Broker topics.
   */
  public getOpenaireBrokerTopics(): Observable<OpenaireBrokerTopicObject[]> {
    return this.store.pipe(select(openaireBrokerTopicsObjectSelector()));
  }

  /**
   * Returns the information about the loading status of the OpenAIRE Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isOpenaireBrokerTopicsLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isOpenaireBrokerTopicsLoadedSelector),
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Returns the information about the loading status of the OpenAIRE Broker topics (whether or not they were loaded).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loaded, 'false' otherwise.
   */
  public isOpenaireBrokerTopicsLoaded(): Observable<boolean> {
    return this.store.pipe(select(isOpenaireBrokerTopicsLoadedSelector));
  }

  /**
   * Returns the information about the processing status of the OpenAIRE Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isOpenaireBrokerTopicsProcessing(): Observable<boolean> {
    return this.store.pipe(select(sOpenaireBrokerTopicsProcessingSelector));
  }

  /**
   * Returns, from the state, the total available pages of the OpenAIRE Broker topics.
   *
   * @return Observable<number>
   *    The number of the OpenAIRE Broker topics pages.
   */
  public getOpenaireBrokerTopicsTotalPages(): Observable<number> {
    return this.store.pipe(select(getOpenaireBrokerTopicsTotalPagesSelector));
  }

  /**
   * Returns the current page of the OpenAIRE Broker topics, from the state.
   *
   * @return Observable<number>
   *    The number of the current OpenAIRE Broker topics page.
   */
  public getOpenaireBrokerTopicsCurrentPage(): Observable<number> {
    return this.store.pipe(select(getOpenaireBrokerTopicsCurrentPageSelector));
  }

  /**
   * Returns the total number of the OpenAIRE Broker topics.
   *
   * @return Observable<number>
   *    The number of the OpenAIRE Broker topics.
   */
  public getOpenaireBrokerTopicsTotals(): Observable<number> {
    return this.store.pipe(select(getOpenaireBrokerTopicsTotalsSelector));
  }

  /**
   * Dispatch a request to change the OpenAIRE Broker topics state, retrieving the topics from the server.
   *
   * @param elementsPerPage
   *    The number of the topics per page.
   * @param currentPage
   *    The number of the current page.
   */
  public dispatchRetrieveOpenaireBrokerTopics(elementsPerPage: number, currentPage: number): void {
    this.store.dispatch(new RetrieveAllTopicsAction(elementsPerPage, currentPage));
  }
}

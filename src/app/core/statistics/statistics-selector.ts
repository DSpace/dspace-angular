import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatisticsState } from './statistics.reducer';

/**
 * Returns the statistic state.
 * @function getStatisticState
 * @param {State} state Top level state.
 * @returns  {StatisticsState}
 */
const getStatisticState = createFeatureSelector<StatisticsState>('statistics');

/**
 * Returns a category id.
 * @function _getCategoryId
 * @param {StatisticsState} state
 * @returns {string}
 */
const _getCategoryId = (state: StatisticsState) => state.categoryId;

/**
 * Returns a report id.
 * @function _getReportId
 * @param {StatisticsState} state
 * @returns {string} reportId
 */
const _getReportId = (state: StatisticsState) => state.reportId;

/**
 * Returns the category id.
 * @function getCategoryId
 * @param {StatisticsState} state
 * @param {any} props
 * @return {string}
 */
export const getCategoryId = createSelector(getStatisticState, _getCategoryId);

/**
 * Returns the report id.
 * @function getReportId
 * @param {StatisticsState} state
 * @param {any} props
 * @return {string}
 */
export const getReportId = createSelector(getStatisticState, _getReportId);

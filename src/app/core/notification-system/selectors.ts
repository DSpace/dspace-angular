/**
 * Returns the user state.
 * @function getUserState
 * @param {CoreState} state Top level state.
 * @return {AuthState}
 */
import { CoreState } from '../core-state.model';

export const notificationsStateSelector = (state: CoreState) => state.notifications;

import { CoreState } from '@dspace/core/core-state.model';
import { createSelector } from '@ngrx/store';

import { coreSelector } from '../core.selectors';

export const correlationIdSelector = createSelector(coreSelector, (state: CoreState) => state.correlationId);

import { createFeatureSelector } from '@ngrx/store';
import { CoreState } from './core.reducers';

export const coreSelector = createFeatureSelector<CoreState>('core');

import { type } from '@dspace/core';
import { Action } from '@ngrx/store';

export const HostWindowActionTypes = {
  RESIZE: type('dspace/host-window/RESIZE'),
};

export class HostWindowResizeAction implements Action {
  type = HostWindowActionTypes.RESIZE;
  payload: {
    width: number;
    height: number;
  };

  constructor(width: number, height: number) {
    this.payload = { width, height };
  }
}

export type HostWindowAction
  = HostWindowResizeAction;

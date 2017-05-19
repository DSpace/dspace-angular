import { Action } from "@ngrx/store";
import { type } from "./ngrx/type";

export const HostWindowActionTypes = {
  RESIZE: type('dspace/host-window/RESIZE')
};

export class HostWindowResizeAction implements Action {
  type = HostWindowActionTypes.RESIZE;
  payload: {
    width: number;
    height: number;
    breakPoint: string;
  };

  constructor(width: number, height: number) {
    let breakPoint = this.getBreakpoint(width);
    this.payload = { width, height, breakPoint }
  }

  getBreakpoint(windowWidth: number) {
    if(windowWidth < 575) {
      return 'xs';
    } else if (windowWidth >= 576 && windowWidth < 767) {
      return 'sm';
    } else if (windowWidth >= 768 && windowWidth < 991) {
      return 'md';
    } else if (windowWidth >= 992 && windowWidth < 1199) {
      return 'lg';
    } else if (windowWidth >= 1200) {
      return 'xl';
    }
  }
}

export type HostWindowAction
  = HostWindowResizeAction;

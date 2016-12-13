import { Action } from "@ngrx/store";

export class HostWindowActions {
  static RESIZE = 'dspace/host-window/RESIZE';
  static resize(newWidth: number, newHeight: number): Action {
    return {
      type: HostWindowActions.RESIZE,
      payload: {
        width: newWidth,
        height: newHeight
      }
    }
  }
}

import { of as observableOf } from 'rxjs';

export const mockTruncatableService: any = {
  /* tslint:disable:no-empty */
  isCollapsed: (id: string) => {
    if (id === '1') {
      return observableOf(true);
    } else {
      return observableOf(false);
    }
  },
  expand: (id: string) => {
  },
  collapse: (id: string) => {
  },
  toggle: (id: string) => {
  }
  /* tslint:enable:no-empty */
};

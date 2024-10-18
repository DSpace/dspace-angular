import {
  Observable,
  of as observableOf,
} from 'rxjs';

export class ObjectSelectServiceStub {

  ids: string[] = [];

  constructor(ids?: string[]) {
    if (ids) {
      this.ids = ids;
    }
  }

  getSelected(id: string): Observable<boolean> {
    if (this.ids.indexOf(id) > -1) {
      return observableOf(true);
    } else {
      return observableOf(false);
    }
  }

  getAllSelected(): Observable<string[]> {
    return observableOf(this.ids);
  }

  switch(id: string) {
    const index = this.ids.indexOf(id);
    if (index > -1) {
      this.ids.splice(index, 1);
    } else {
      this.ids.push(id);
    }
  }

  reset() {
    this.ids = [];
  }
}

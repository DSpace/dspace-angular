import { Observable } from 'rxjs/Observable';

export class ItemSelectServiceStub {

  ids: string[] = [];

  constructor(ids?: string[]) {
    if (ids) {
      this.ids = ids;
    }
  }

  getSelected(id: string): Observable<boolean> {
    if (this.ids.indexOf(id) > -1) {
      return Observable.of(true);
    } else {
      return Observable.of(false);
    }
  }

  getAllSelected(): Observable<string[]> {
    return Observable.of(this.ids);
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

import { Injectable } from "@angular/core";
import { RequestEntry, RequestState } from "./request.reducer";
import { Store } from "@ngrx/store";
import { hasValue } from "../../shared/empty.util";
import { Observable } from "rxjs/Observable";

@Injectable()
export class RequestService {

  constructor(private store: Store<RequestState>) {
  }

  isPending(href: string): boolean {
    let isPending = false;
    this.store.select<RequestEntry>('core', 'data', 'request', href)
      .take(1)
      .subscribe((re: RequestEntry) =>  {
        isPending = (hasValue(re) && !re.completed)
    });

    return isPending;
  }

  get(href: string): Observable<RequestEntry> {
    return this.store.select<RequestEntry>('core', 'data', 'request', href);
  }
}

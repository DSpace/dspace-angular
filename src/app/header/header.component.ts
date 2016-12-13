import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { HeaderState } from "./header.reducer";
import { HeaderActions } from "./header.actions";
import { Observable } from "rxjs";
import 'rxjs/add/operator/filter';

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.css'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<HeaderState>
  ) {
  }

  ngOnInit(): void {
    this.isNavBarCollapsed = this.store.select('headerReducer')
      //ensure that state is not null, can happen when using AoT compilation
      .filter((state: HeaderState) => state !== null && state !== undefined)
      //unwrap navCollapsed
      .map(({ navCollapsed }: HeaderState) => navCollapsed);
  }

  private collapse(): void {
    this.store.dispatch(HeaderActions.collapse());
  }

  private expand(): void {
    this.store.dispatch(HeaderActions.expand());
  }

  public toggle(): void {
    this.store.dispatch(HeaderActions.toggle());
  }

}

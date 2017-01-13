import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { HeaderState } from "./header.reducer";
import { Observable } from "rxjs";
import {
  HeaderCollapseAction,
  HeaderExpandAction,
  HeaderToggleAction
} from "./header.actions";

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
    this.isNavBarCollapsed = this.store.select('header')
      //unwrap navCollapsed
      .map(({ navCollapsed }: HeaderState) => navCollapsed);
  }

  private collapse(): void {
    this.store.dispatch(new HeaderCollapseAction());
  }

  private expand(): void {
    this.store.dispatch(new HeaderExpandAction());
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}

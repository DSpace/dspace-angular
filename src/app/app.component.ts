import { Component, HostListener, Input, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';

import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  // TODO: move header and all related properties into its own component

  private navCollapsed: boolean;

  private routerSubscription: any;

  constructor(private router: Router) {
    this.collapse();
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.collapse();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.collapse();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private collapse(): void {
    this.navCollapsed = true;
  }

  private expand(): void {
    this.navCollapsed = false;
  }

  public toggle(): void {
    this.navCollapsed ? this.expand() : this.collapse();
  }

  public isNavBarCollaped(): boolean {
    return this.navCollapsed;
  }

}

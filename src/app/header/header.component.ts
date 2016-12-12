import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationEnd, Event } from "@angular/router";

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.css'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnDestroy, OnInit {
  private navCollapsed: boolean;
  private routerSubscription: any;

  constructor(
    private router: Router
  ) {
    this.collapse();
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.collapse();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event): void {
    this.collapse();
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

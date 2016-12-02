import { Component, HostListener, Input, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from 'ng2-translate';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

  // TODO: move header and all related properties into its own component

  private navCollapsed: boolean;

  private routerSubscription: any;


  private translateSubscription: any;

  example: string;

  data: any = {
    greeting: 'Hello',
    recipient: 'World'
  }

  constructor(public translate: TranslateService, private router: Router) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    this.collapse();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.collapse();
      }
    });
    this.translateSubscription = this.translate.get('example.with.data', { greeting: 'Hello', recipient: 'DSpace' }).subscribe((translation: string) => {
      this.example = translation;
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
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

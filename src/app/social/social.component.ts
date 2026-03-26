import {
  AsyncPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Observable } from 'rxjs';

import { SocialService } from './social.service';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
  ],
})
/**
 * Component to render dynamically the social2 buttons using addToAny plugin
 */
export class SocialComponent implements OnInit, AfterViewInit {

  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;

  showOnCurrentRoute$: Observable<boolean>;

  buttonList: string[];
  showPlusButton: boolean;
  title: string;
  url: string;
  showCounters: boolean;

  /**
   * Whether the current page has a scrollbar or not.
   * If false, we show the bar without waiting for scroll.
   */
  pageIsScrollable = true;

  constructor(
    private socialService: SocialService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (this.socialService.enabled) {
      this.buttonList = this.socialService.configuration.buttons;
      this.showPlusButton = this.socialService.configuration.showPlusButton;
      this.showCounters = this.socialService.configuration.showCounters;
      this.title = this.socialService.configuration.title;
      this.socialService.initializeAddToAnyScript();
      this.showOnCurrentRoute$ = this.socialService.showOnCurrentRoute$;
    }
  }

  ngAfterViewInit() {
    if (this.socialService.enabled && isPlatformBrowser(this.platformId)) {
      this.pageIsScrollable = document.body.scrollHeight > window.innerHeight;
      this.cdr.detectChanges();
    }
  }

}

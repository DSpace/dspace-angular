import {
  AsyncPipe,
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

  constructor(
    private socialService: SocialService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private _document: Document,
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
      setTimeout(() => {
        const footer = this._document.querySelector('footer');
        const bar = this._document.getElementById('dspace-a2a');

        if (footer && bar) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              bar.style.opacity = entry.isIntersecting ? '0' : '1';
              bar.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
            });
          });
          observer.observe(footer);
        }
      }, 300);
    }
  }

}

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

  /**
   * Embeds the social links bar inside the footer so it is always visible
   * on all pages, including item pages that do not scroll.
   */
  ngAfterViewInit() {
    if (!this.socialService.enabled || !isPlatformBrowser(this.platformId)) {return;}

    setTimeout(() => {
      const footer = this._document.querySelector('footer');
      const bar = this._document.getElementById('dspace-a2a');
      if (!footer || !bar) {return;}

      bar.classList.remove('a2a_floating_style');
      bar.style.setProperty('position', 'relative', 'important');
      bar.style.setProperty('opacity', '1', 'important');
      bar.style.setProperty('pointer-events', 'auto', 'important');
      bar.style.bottom = 'auto';
      bar.style.right = 'auto';
      footer.prepend(bar);
    }, 1000);
  }

}

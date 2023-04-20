import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from './social.service';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
/**
 * Component to render dynamically the social2 buttons using addThis plugin
 */
export class SocialComponent implements OnInit, OnDestroy {

  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;

  subscription;

  constructor(@Inject(DOCUMENT) private _document: Document,
              @Inject(PLATFORM_ID) protected platformId: Object,
              private socialService: SocialService,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription = this.socialService.showSocialButtons(this.activatedRoute).subscribe((show) => {
        if (show) {
          this.showSocialButtons();
        } else {
          this.hideSocialButtons();
        }
      });
    }
  }

  showSocialButtons() {
    if (!this.script) {
      this.script = this.socialService.initializeAddThisScript(this._document);
    }
    this.socialService.show(this._document);
  }

  hideSocialButtons() {
    this.socialService.hide(this._document);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}

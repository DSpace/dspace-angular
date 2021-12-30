import {
  Component,
  Inject, OnDestroy,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from './social.service';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
/**
 * Component to render dinamically the social2 buttons using addThis plugin
 */
export class SocialComponent implements OnInit, OnDestroy {

  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;

  subscription;

  constructor(@Inject(DOCUMENT) private _document: Document,
              private socialService: SocialService,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.subscription = this.socialService.showSocialButtons(this.activatedRoute).subscribe((show) => {
      if (show) {
        this.showSocialButtons();
      } else {
        this.hideSocialButtons();
      }
    });
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

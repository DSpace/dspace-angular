import {
  Component,
  Inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {environment} from '../../environments/environment.common';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
/**
 * Component to render dinamically the social2 buttons using addThis plugin
 */
export class SocialComponent implements OnChanges {
  /**
   * The official site ID of addthis plugin
   */
  idSocial: string = environment.addThisPlugin.siteId;
  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;
  /**
   * Input to show or not the social2 buttons
   */
  @Input() showSocialButtons: boolean;
  /**
   * The social2 buttons shown in ui
   */
  socialButtons: HTMLElement;
  /**
   * Boolean that represents if the script is uploaded in dom
   */
  appended = false;
  constructor(private _renderer2: Renderer2,
              @Inject(DOCUMENT) private _document: Document,
  ) {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.showSocialButtons) {
      if (!this.script) {
        this.initializeScript();
      }
      if (changes.showSocialButtons.currentValue) {
        if (this.appended) {
          this.socialButtons.style.display = 'block';
        } else {
          this._document.body.appendChild(this.script);
          this.appended = true;
        }
      } else {
        if (this.script) {
          if (this.appended) {
            this.socialButtons = this._document.querySelector('#at-expanding-share-button');
          }
          if (this.socialButtons) {
            this.socialButtons.style.display = 'none';
          }
        }
      }
    }
  }

  private initializeScript() {
    this.script = this._document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.src = 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=' + this.idSocial;
  }
}

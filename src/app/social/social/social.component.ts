import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {environment} from '../../../environments/environment.common';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
/**
 * Component to render dinamically the social buttons using addThis plugn
 */
export class SocialComponent implements OnInit, OnChanges {
  /**
   * The official site ID of addthis plugin
   */
  idSocial: string = environment.addThisPlugin.siteId;
  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;
  /**
   * Input to show or not the social buttons
   */
  @Input() showSocialButtons: boolean;
  /**
   * The social buttons shown in ui
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

  ngOnInit() {
    if (!this.script) {
      this.initializeScript();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showSocialButtons) {
      if (!this.script) {
        this.initializeScript();
      }
      if (changes.showSocialButtons.currentValue) {
        if (this.appended) {
          this._renderer2.appendChild(this._document.body, this.socialButtons);
        }
        if (!this.appended) {
          this._document.body.appendChild(this.script);
          this.appended = true;
        }
      } else {
        if (this.script) {
          this.socialButtons = this._document.querySelector('#at-expanding-share-button');
          if (this.socialButtons) {
            this._document.querySelector('#at-expanding-share-button').remove();
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

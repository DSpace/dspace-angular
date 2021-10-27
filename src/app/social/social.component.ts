import {
  Component,
  Inject,
  OnInit, Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {environment} from '../../environments/environment.common';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {KlaroService} from '../shared/cookies/klaro.service';
import {CookieService} from '../core/services/cookie.service';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
/**
 * Component to render dinamically the social2 buttons using addThis plugin
 */
export class SocialComponent implements OnInit {
  /**
   * The official site ID of addthis plugin
   */
  idSocial: string = environment.addThisPlugin.siteId;
  /**
   * The official site url of script
   */
  urlSocialScript: string = environment.addThisPlugin.scriptUrl;
  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;
  /**
   * Boolean to show or not the social buttons
   */
  showSocialButtons = false;
  /**
   * The social2 buttons shown in ui
   */
  socialButtons: HTMLElement;
  /**
   * Boolean that represents if the script is uploaded in dom
   */
  appended = false;
  shareAccepted = environment.addThisPlugin.socialNetworksEnabled;
  constructor(private _renderer2: Renderer2,
              @Inject(DOCUMENT) private _document: Document,
              @Optional() private cookies: KlaroService,
              protected cookie: CookieService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
    const cookiesAccepted = this.cookie.getAll();
    if (cookiesAccepted['klaro-anonymous'] && cookiesAccepted['klaro-anonymous']['add-this']) {
      this.shareAccepted = true;
    }
    environment.addThisPlugin.socialNetworksEnabled = this.shareAccepted;
  }

  ngOnInit() {
    if (!this.shareAccepted) {
      return;
    }
    if (!this.script) {
      this.initializeScript();
    }
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd),
      map(evt => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe(route => {
      if (route.showSocialButtons !== undefined) {
        if (route.showSocialButtons) {
          if (this.appended) {
            this.socialButtons.style.display = 'block';
          } else {
            this._document.body.appendChild(this.script);
            this.appended = true;
          }
        } else {
          this.socialButtons = this._document.querySelector('#at-expanding-share-button');
          if (this.socialButtons) {
            this.socialButtons.style.display = 'none';
          }
        }
      } else {
        this.socialButtons = this._document.querySelector('#at-expanding-share-button');
        if (this.socialButtons) {
          this.socialButtons.style.display = 'none';
        }
      }
    });
  }
  private initializeScript() {
    this.script = this._document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.src = this.urlSocialScript + this.idSocial;
  }
}

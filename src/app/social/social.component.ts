import { Component, Inject, OnInit } from '@angular/core';
import { SocialService } from './social.service';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
/**
 * Component to render dynamically the social2 buttons using addToAny plugin
 */
export class SocialComponent implements OnInit {

  /**
   * The script containing the profile ID
   */
  script: HTMLScriptElement;

  showOnCurrentRoute$: Observable<boolean>;

  buttonList: string[];
  showPlusButton: boolean;
  title: string;
  showCounters: boolean;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private socialService: SocialService,
  ) {
  }

  ngOnInit() {
    if (this.socialService.enabled) {
      this.buttonList = this.socialService.configuration.buttons;
      this.showPlusButton = this.socialService.configuration.showPlusButton;
      this.showCounters = this.socialService.configuration.showCounters;
      this.title = this.socialService.configuration.title;
      this.socialService.initializeAddToAnyScript(this._document);
      this.showOnCurrentRoute$ = this.socialService.showOnCurrentRoute$;
    }
  }

}

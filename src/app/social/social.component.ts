import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SocialService } from './social.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  url: string;
  showCounters: boolean;

  constructor(
    private socialService: SocialService,
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

}

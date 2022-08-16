import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';

import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { Observable } from 'rxjs';
import { NativeWindowRef, NativeWindowService } from 'src/app/core/services/window.service';

@Component({
  selector: 'ds-google-recaptcha',
  templateUrl: './google-recaptcha.component.html',
  styleUrls: ['./google-recaptcha.component.scss'],
})
export class GoogleRecaptchaComponent implements OnInit {

  @Input() captchaMode: string;
  /**
   * An EventEmitter that's fired whenever the form is being submitted
   */
  @Output() executeRecaptcha: EventEmitter<any> = new EventEmitter();

  recaptchaKey$: Observable<any>;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private configService: ConfigurationDataService,
  ) {
  }

  /**
   * Retrieve the google recaptcha site key
   */
  ngOnInit() {
    this.recaptchaKey$ = this.configService.findByPropertyName('google.recaptcha.key.site').pipe(
      getFirstSucceededRemoteDataPayload(),
    );
    if (this.captchaMode === 'invisible') {
      this._window.nativeWindow.executeRecaptcha = this.execute;
    }
  }

  execute = (event) => {
    this.executeRecaptcha.emit(event);
  };

}

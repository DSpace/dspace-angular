import {Component, Inject, OnInit} from '@angular/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import {TranslateService} from '@ngx-translate/core';
import {LangConfig} from "../../../config/lang-config.interface";

@Component({
  selector: 'ds-lang-switch',
  styleUrls: ['lang-switch.component.scss'],
  templateUrl: 'lang-switch.component.html',
})

/**
 * Component representing a switch for changing the interface language throughout the application
 * The switch itself is internationalized itself, showing the activated languages in a dropdown, in the active language.
 * If only one language is active, the component will disappear as there are no languages to switch to.
 */
export class LangSwitchComponent implements OnInit {

  activeLangs: Array<LangConfig> = this.config.lang.filter(LangConfig => LangConfig.active === true);
  moreThanOneLanguage: boolean = (this.activeLangs.length > 1);

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    // set loading
  }

  /**
   * Returns the label for the current language
   */
  currentLangLabel(): string {
    return this.activeLangs.find(LangConfig => LangConfig.code === this.translate.currentLang).label;
  }

  /**
   * Returns the label for a specific language code
   */
  langLabel(langcode: string): string {
    return this.activeLangs.find(LangConfig => LangConfig.code === langcode).label;
  }

}

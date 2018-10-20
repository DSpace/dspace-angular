import {Component, Inject, OnInit} from '@angular/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import {TranslateService} from "@ngx-translate/core";

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

  moreThanOneLanguage: boolean = (this.config.lang.active.length > 1);
  activeLangLabels: string[] = this.config.lang.activeLabels;

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
  currentLangLabel(): string{
    let returnIndex: number = this.translate.getLangs().indexOf(this.translate.currentLang);
    return this.activeLangLabels[returnIndex];
  }

  /**
   * Returns the label a specific languages, assuming the index of the language
   * is the same in the list of active languages, as the index of the label in the list of labels.
   */
  langLabel(lang: string): string{
    let returnIndex: number = this.translate.getLangs().indexOf(lang);
    return this.activeLangLabels[returnIndex];
  }

}

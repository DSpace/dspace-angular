import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { ExternalScriptLoaderService } from 'src/app/shared/utils/scripts-loader/external-script-loader.service';
import {
  ExternalScriptsNames,
  ExternalScriptsStatus,
} from 'src/app/shared/utils/scripts-loader/external-script.model';
import { Item } from '../../../../../../core/shared/item.model';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Component({
  selector: 'ds-item-page-altmetric-field',
  templateUrl: './item-page-altmetric-field.component.html',
})
export class ItemPageAltmetricFieldComponent implements AfterViewInit {
  @Input() item: Item;

  @Output() widgetLoaded = new EventEmitter<boolean>();

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private scriptLoader: ExternalScriptLoaderService
  ) {}

  ngAfterViewInit() {
    if (!this.appConfig.item.showAltmetricBadge) {
      return;
    }

    this.scriptLoader
      .load(ExternalScriptsNames.ALTMETRIC)
      .then((data) => this.reloadBadge(data))
      .catch((error) => console.error(error));
  }

  /**
   * We ensure that the badge is visible after the script is loaded
   * @param data The data returned from the promise
   */
  private reloadBadge(data: any[]) {
    if (data.find((element) => this.isLoaded(element))) {
      const initMethod = '_altmetric_embed_init';
      window[initMethod]();
    }
  }

  /**
   * Check if the script has been previously loaded in the DOM
   * @param element The resolve element from the promise
   * @returns true if the script has been already loaded, false if not
   */
  private isLoaded(element: any): unknown {
    return (
      element.script === ExternalScriptsNames.ALTMETRIC &&
      element.status === ExternalScriptsStatus.ALREADY_LOADED
    );
  }

  @HostListener('window:altmetric:show', ['$event'])
  private onWidgetShow(event: Event) {
    this.widgetLoaded.emit(true);
  }
}

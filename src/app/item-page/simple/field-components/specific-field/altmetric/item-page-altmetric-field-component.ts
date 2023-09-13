import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { BrowseDefinitionDataService } from 'src/app/core/browse/browse-definition-data.service';
import { ExternalScriptLoaderService } from 'src/app/shared/utils/scripts-loader/external-script-loader.service';
import {
  ExternalScriptsNames,
  ExternalScriptsStatus,
} from 'src/app/shared/utils/scripts-loader/external-script.model';

@Component({
  selector: 'ds-item-page-altmetric-field',
  templateUrl: './item-page-altmetric-field.component.html',
  styleUrls: [
    '../../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component.scss',
  ],
})
export class ItemPageAltmetricFieldComponent
  extends ItemPageFieldComponent
  implements AfterViewInit
{
  @Input() item: Item;

  constructor(
    protected browseDefinitionDataService: BrowseDefinitionDataService,
    private scriptLoader: ExternalScriptLoaderService
  ) {
    super(browseDefinitionDataService);
  }

  ngAfterViewInit() {
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
      window['_altmetric_embed_init']();
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
}

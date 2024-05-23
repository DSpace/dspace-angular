import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Collection } from '../../../core/shared/collection.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-collection-list-element',
  styleUrls: ['./collection-list-element.component.scss'],
  templateUrl: './collection-list-element.component.html',
  standalone: true,
  imports: [NgIf, RouterLink],
})
/**
 * Component representing list element for a collection
 */
@listableObjectComponent(Collection, ViewMode.ListElement)
export class CollectionListElementComponent extends AbstractListableElementComponent<Collection> {

  /**
   * The current language of the page
   */
  currentLanguage: string = environment.defaultLanguage;

  constructor(
    public dsoNameService: DSONameService,
    public translateService: TranslateService,
  ) {
    super(dsoNameService);

    this.currentLanguage = translateService.currentLang;
  }
}

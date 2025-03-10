import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Community } from '../../../core/shared/community.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['./community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html',
  standalone: true,
  imports: [NgIf, RouterLink],
})
/**
 * Component representing a list element for a community
 */
@listableObjectComponent(Community, ViewMode.ListElement)
export class CommunityListElementComponent extends AbstractListableElementComponent<Community> {

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

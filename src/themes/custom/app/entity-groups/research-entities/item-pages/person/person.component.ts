import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GenericItemPageFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { TabbedRelatedEntitiesSearchComponent } from 'src/app/item-page/simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { RelatedItemsComponent } from 'src/app/item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from 'src/app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedResultsBackButtonComponent } from 'src/app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from 'src/app/thumbnail/themed-thumbnail.component';

import { Context } from '../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { PersonComponent as BaseComponent } from '../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('Person', ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-person',
  // styleUrls: ['./person.component.scss'],
  styleUrls: ['../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component.scss'],
  // templateUrl: './person.component.html',
  templateUrl: '../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component.html',
  standalone: true,
  imports: [NgIf, ThemedResultsBackButtonComponent, ThemedItemPageTitleFieldComponent, DsoEditMenuComponent, MetadataFieldWrapperComponent, ThemedThumbnailComponent, GenericItemPageFieldComponent, RelatedItemsComponent, RouterLink, TabbedRelatedEntitiesSearchComponent, AsyncPipe, TranslateModule],
})
export class PersonComponent extends BaseComponent {
}

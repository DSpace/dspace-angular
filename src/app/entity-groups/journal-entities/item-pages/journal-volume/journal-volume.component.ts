import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { GenericItemPageFieldComponent } from '../../../../item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemComponent } from '../../../../item-page/simple/item-types/shared/item.component';
import { RelatedItemsComponent } from '../../../../item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';

@listableObjectComponent('JournalVolume', ViewMode.StandalonePage)
@Component({
  selector: 'ds-journal-volume',
  styleUrls: ['./journal-volume.component.scss'],
  templateUrl: './journal-volume.component.html',
  standalone: true,
  imports: [NgIf, ThemedResultsBackButtonComponent, ThemedItemPageTitleFieldComponent, DsoEditMenuComponent, MetadataFieldWrapperComponent, ThemedThumbnailComponent, GenericItemPageFieldComponent, RelatedItemsComponent, RouterLink, AsyncPipe, TranslateModule],
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Volume
 */
export class JournalVolumeComponent extends ItemComponent {
}

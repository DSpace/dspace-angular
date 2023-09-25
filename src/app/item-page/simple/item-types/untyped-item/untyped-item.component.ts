import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';
import {
  ThemedItemPageTitleFieldComponent
} from '../../field-components/specific-field/title/themed-item-page-field.component';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  MetadataFieldWrapperComponent
} from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { ThemedMediaViewerComponent } from '../../../media-viewer/themed-media-viewer.component';
import { ThemedFileSectionComponent } from '../../field-components/file-section/themed-file-section.component';
import { ItemPageDateFieldComponent } from '../../field-components/specific-field/date/item-page-date-field.component';
import {
  ThemedMetadataRepresentationListComponent
} from '../../metadata-representation-list/themed-metadata-representation-list.component';
import {
  GenericItemPageFieldComponent
} from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { MiradorViewerComponent } from '../../../mirador-viewer/mirador-viewer.component';
import {
  ThemedResultsBackButtonComponent
} from '../../../../shared/results-back-button/themed-results-back-button.component';
import { CollectionsComponent } from '../../../field-components/collections/collections.component';
import { RouterLink } from '@angular/router';
import { ItemPageUriFieldComponent } from '../../field-components/specific-field/uri/item-page-uri-field.component';
import { CommonModule } from '@angular/common';
import {
  ItemPageAbstractFieldComponent
} from '../../field-components/specific-field/abstract/item-page-abstract-field.component';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ThemedItemPageTitleFieldComponent,
    DsoEditMenuComponent,
    MetadataFieldWrapperComponent,
    ThemedThumbnailComponent,
    ThemedMediaViewerComponent,
    ThemedFileSectionComponent,
    ItemPageDateFieldComponent,
    ThemedMetadataRepresentationListComponent,
    GenericItemPageFieldComponent,
    TranslateModule,
    MiradorViewerComponent,
    ThemedResultsBackButtonComponent,
    CollectionsComponent,
    RouterLink,
    ItemPageUriFieldComponent,
    ItemPageAbstractFieldComponent
  ]
})
export class UntypedItemComponent extends ItemComponent {

}

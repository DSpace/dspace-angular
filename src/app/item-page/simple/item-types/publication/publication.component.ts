import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';
import {
  ThemedResultsBackButtonComponent
} from '../../../../shared/results-back-button/themed-results-back-button.component';
import { MiradorViewerComponent } from '../../../mirador-viewer/mirador-viewer.component';
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
import { RelatedItemsComponent } from '../../related-items/related-items-component';
import {
  ItemPageAbstractFieldComponent
} from '../../field-components/specific-field/abstract/item-page-abstract-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { ItemPageUriFieldComponent } from '../../field-components/specific-field/uri/item-page-uri-field.component';
import { CollectionsComponent } from '../../../field-components/collections/collections.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ThemedResultsBackButtonComponent,
    MiradorViewerComponent,
    ThemedItemPageTitleFieldComponent,
    DsoEditMenuComponent,
    MetadataFieldWrapperComponent,
    ThemedThumbnailComponent,
    ThemedMediaViewerComponent,
    ThemedFileSectionComponent,
    ItemPageDateFieldComponent,
    ThemedMetadataRepresentationListComponent,
    GenericItemPageFieldComponent,
    RelatedItemsComponent,
    ItemPageAbstractFieldComponent,
    TranslateModule,
    ItemPageUriFieldComponent,
    CollectionsComponent,
    RouterLink
  ]
})
export class PublicationComponent extends ItemComponent {

}

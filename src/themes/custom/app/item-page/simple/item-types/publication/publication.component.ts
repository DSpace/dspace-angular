import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionsComponent } from '../../../../../../../app/item-page/field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../../../../../app/item-page/mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import { ThemedItemPageAbstractFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/abstract/themed-item-page-abstract-field.component';
import { ThemedItemPageDateFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/date/themed-item-page-date-field.component';
import { ThemedGenericItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/themed-generic-item-page-field.component';
import { ThemedGeospatialItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/geospatial/themed-geospatial-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ThemedGenericItemPageUriFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/uri/themed-item-page-uri-field.component';
import { PublicationComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/publication/publication.component';
import { ThemedMetadataRepresentationListComponent } from '../../../../../../../app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { RelatedItemsComponent } from '../../../../../../../app/item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../../../../app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

@listableObjectComponent('Publication', ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-publication',
  // styleUrls: ['./publication.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/simple/item-types/publication/publication.component.scss'],
  // templateUrl: './publication.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/item-types/publication/publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CollectionsComponent,
    DsoEditMenuComponent,
    MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    RelatedItemsComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedGenericItemPageFieldComponent,
    ThemedGenericItemPageUriFieldComponent,
    ThemedGeospatialItemPageFieldComponent,
    ThemedItemPageAbstractFieldComponent,
    ThemedItemPageDateFieldComponent,
    ThemedItemPageTitleFieldComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class PublicationComponent extends BaseComponent {
}

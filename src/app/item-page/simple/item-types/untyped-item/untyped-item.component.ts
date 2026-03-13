import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item } from '@dspace/core/shared/item.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { CollectionsComponent } from '../../../field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../field-components/file-section/themed-file-section.component';
import { ThemedItemPageAbstractFieldComponent } from '../../field-components/specific-field/abstract/themed-item-page-abstract-field.component';
import { ThemedItemPageCcLicenseFieldComponent } from '../../field-components/specific-field/cc-license/themed-item-page-cc-license-field.component';
import { ThemedItemPageDateFieldComponent } from '../../field-components/specific-field/date/themed-item-page-date-field.component';
import { ThemedGenericItemPageFieldComponent } from '../../field-components/specific-field/generic/themed-generic-item-page-field.component';
import { ThemedGeospatialItemPageFieldComponent } from '../../field-components/specific-field/geospatial/themed-geospatial-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../field-components/specific-field/title/themed-item-page-field.component';
import { ThemedGenericItemPageUriFieldComponent } from '../../field-components/specific-field/uri/themed-item-page-uri-field.component';
import { ThemedMetadataRepresentationListComponent } from '../../metadata-representation-list/themed-metadata-representation-list.component';
import { ItemComponent } from '../shared/item.component';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CollectionsComponent,
    DsoEditMenuComponent,
    MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedGenericItemPageFieldComponent,
    ThemedGenericItemPageUriFieldComponent,
    ThemedGeospatialItemPageFieldComponent,
    ThemedItemPageAbstractFieldComponent,
    ThemedItemPageCcLicenseFieldComponent,
    ThemedItemPageDateFieldComponent,
    ThemedItemPageTitleFieldComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class UntypedItemComponent extends ItemComponent {}

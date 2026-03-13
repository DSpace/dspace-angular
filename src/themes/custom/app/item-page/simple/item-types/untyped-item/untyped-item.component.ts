import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionsComponent } from '../../../../../../../app/item-page/field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../../../../../app/item-page/mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import { ThemedItemPageAbstractFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/abstract/themed-item-page-abstract-field.component';
import { ThemedItemPageCcLicenseFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/cc-license/themed-item-page-cc-license-field.component';
import { ThemedItemPageDateFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/date/themed-item-page-date-field.component';
import { ThemedGenericItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/themed-generic-item-page-field.component';
import { ThemedGeospatialItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/geospatial/themed-geospatial-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ThemedGenericItemPageUriFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/uri/themed-item-page-uri-field.component';
import { UntypedItemComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { ThemedMetadataRepresentationListComponent } from '../../../../../../../app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../../../../app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-untyped-item',
  // styleUrls: ['./untyped-item.component.scss'],
  styleUrls: [
    '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss',
  ],
  // templateUrl: './untyped-item.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
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
export class UntypedItemComponent extends BaseComponent {
}

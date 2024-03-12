import { ChangeDetectionStrategy, Component, } from '@angular/core';

import { Context } from '../../../../../../../app/core/shared/context.model';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import {
  UntypedItemComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { CommonModule } from '@angular/common';
import {
  ThemedItemPageTitleFieldComponent
} from '../../../../../../../app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  MetadataFieldWrapperComponent
} from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import {
  ThemedMediaViewerComponent
} from '../../../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import {
  ThemedFileSectionComponent
} from '../../../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import {
  ItemPageDateFieldComponent
} from '../../../../../../../app/item-page/simple/field-components/specific-field/date/item-page-date-field.component';
import {
  ThemedMetadataRepresentationListComponent
} from '../../../../../../../app/item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import {
  GenericItemPageFieldComponent
} from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { MiradorViewerComponent } from '../../../../../../../app/item-page/mirador-viewer/mirador-viewer.component';
import {
  ThemedResultsBackButtonComponent
} from '../../../../../../../app/shared/results-back-button/themed-results-back-button.component';
import {
  CollectionsComponent
} from '../../../../../../../app/item-page/field-components/collections/collections.component';
import { RouterLink } from '@angular/router';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';
import {
  ItemPageAbstractFieldComponent
} from '../../../../../../../app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';

/**
 * Component that represents an untyped Item page
 */
@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-untyped-item',
  // styleUrls: ['./untyped-item.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss'],
  // templateUrl: './untyped-item.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
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
export class UntypedItemComponent extends BaseComponent {
}

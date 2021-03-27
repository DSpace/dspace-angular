import {IIIFSearchableComponent} from './item-pages/iiif-searchable/iiif-searchable.component';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {IIIFSearchableGridElementComponent} from './item-grid-elements/iiif-searchable/iiif-searchable-grid-element.component';
import {IIIFSearchableResultListElementComponent} from './item-list-elements/search-result-list-elements/iiif-searchable/iiif-searchable-search-result-list-element.component';
import {IIIFSearchableSearchResultGridElementComponent} from './item-grid-elements/search-result-grid-elements/iiif-searchable/iiif-searchable-search-result-grid-element.component';
import {MiradorViewerComponent} from './mirador-viewer/mirador-viewer.component';
import {IIIFSearchableListElementComponent} from './item-list-elements/iiif-searchable/iiif-searchable-list-element.component';
import {IIIFComponent} from './item-pages/iiif/iiif.component';
import {IIIFListElementComponent} from './item-list-elements/iiif/iiif-list-element.component';
import {IIIFGridElementComponent} from './item-grid-elements/iiif/iiif-grid-element.component';
import {IIIFResultListElementComponent} from './item-list-elements/search-result-list-elements/iiif/iiif-search-result-list-element.component';
import {IIIFSearchResultGridElementComponent} from './item-grid-elements/search-result-grid-elements/iiif/iiif-search-result-grid-element.component';

const ENTRY_COMPONENTS = [
  IIIFComponent,
  IIIFSearchableComponent,
  IIIFListElementComponent,
  IIIFSearchableListElementComponent,
  IIIFGridElementComponent,
  IIIFSearchableGridElementComponent,
  IIIFResultListElementComponent,
  IIIFSearchableResultListElementComponent,
  IIIFSearchResultGridElementComponent,
  IIIFSearchableSearchResultGridElementComponent,
  MiradorViewerComponent
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ...ENTRY_COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IIIFEntitiesModule {

  static withEntryComponents() {
    return {
      ngModule: IIIFEntitiesModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}

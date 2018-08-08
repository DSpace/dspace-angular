import { Component, Input, Inject } from '@angular/core';

import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../+search-page/search-options.model';
import { Metadatum } from '../../../core/shared/metadatum.model';

@Component({
  selector: 'ds-metadata-list-element',
  styleUrls: ['./metadata-list-element.component.scss'],
  templateUrl: './metadata-list-element.component.html'
})

@renderElementsFor(Metadatum, ViewMode.List)
export class MetadataListElementComponent extends AbstractListableElementComponent<Metadatum> {}

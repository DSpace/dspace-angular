import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../../core/shared/item.model';
import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the inline  metadata group fields
 */
@Component({
  selector: 'ds-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    MetadataRenderComponent,
    AsyncPipe,
  ],
})
export class InlineComponent extends MetadataGroupComponent implements OnInit {

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

}

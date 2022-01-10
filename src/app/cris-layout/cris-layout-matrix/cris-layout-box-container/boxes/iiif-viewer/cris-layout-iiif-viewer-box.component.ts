import { Component, Inject, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-iiif-viewer-box',
  templateUrl: './cris-layout-iiif-viewer-box.component.html',
  styleUrls: ['./cris-layout-iiif-viewer-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.IIIFVIEWER)
export class CrisLayoutIIIFViewerBoxComponent extends CrisLayoutBoxModelComponent  implements OnInit {

  constructor(
    protected translateService: TranslateService,
    public authService: AuthService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

}

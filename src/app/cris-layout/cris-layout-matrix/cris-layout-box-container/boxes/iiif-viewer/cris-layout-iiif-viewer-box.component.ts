import { Component, Inject, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../core/auth/auth.service';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { getDSpaceQuery } from '../../../../../item-page/simple/item-types/shared/item-iiif-utils';
import { RouteService } from '../../../../../core/services/route.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-cris-layout-iiif-viewer-box',
  templateUrl: './cris-layout-iiif-viewer-box.component.html',
  styleUrls: ['./cris-layout-iiif-viewer-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.IIIFVIEWER)
export class CrisLayoutIIIFViewerBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  isSearchable: boolean;
  query$: Observable<string>;

  constructor(
    protected translateService: TranslateService,
    public authService: AuthService,
    protected routeService: RouteService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isSearchable = this.item.firstMetadataValue('iiif.search.enabled') === 'true';
    // Search is not working: error 501 "Not Implemented"
    if (this.isSearchable) {
      this.query$ = getDSpaceQuery(this.item, this.routeService);
    }
  }

}

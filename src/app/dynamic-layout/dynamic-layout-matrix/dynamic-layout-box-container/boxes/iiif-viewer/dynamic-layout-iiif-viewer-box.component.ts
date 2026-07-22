import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DynamicLayoutBox } from '@dspace/core/layout/models/box.model';
import { RouteService } from '@dspace/core/services/route.service';
import { Item } from '@dspace/core/shared/item.model';
import { getDSpaceQuery } from '@dspace/core/utilities/item-iiif-utils';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { MiradorViewerComponent } from '../../../../../item-page/mirador-viewer/mirador-viewer.component';
import { DynamicLayoutBoxModelComponent } from '../../../../models/dynamic-layout-box-component.model';

@Component({
  selector: 'ds-dynamic-layout-iiif-viewer-box',
  templateUrl: './dynamic-layout-iiif-viewer-box.component.html',
  styleUrls: ['./dynamic-layout-iiif-viewer-box.component.scss'],
  imports: [
    AsyncPipe,
    MiradorViewerComponent,
  ],
})
export class DynamicLayoutIiifViewerBoxComponent extends DynamicLayoutBoxModelComponent implements OnInit {

  isSearchable: boolean;
  query$: Observable<string>;

  constructor(
    protected translateService: TranslateService,
    public authService: AuthService,
    protected routeService: RouteService,
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
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

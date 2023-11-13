import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { AuthService } from '../../../../../core/auth/auth.service';
import { isNotEmpty } from '../../../../../shared/empty.util';
import { EPerson } from '../../../../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-relation-box.component.html',
  styleUrls: ['./cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.RELATION)
export class CrisLayoutRelationBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;

  /**
   * A boolean representing if to show or not the search notice
   */
  showSearchResultNotice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The search notice message
   */
  searchResultNotice: string;

  constructor(
    protected authService: AuthService,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchFilter = `scope=${this.item.id}`;
    this.configuration = (this.box.configuration as RelationBoxConfiguration)['discovery-configuration'];
    const isResearchOutputsConfiguration =
      this.configuration?.endsWith('researchoutputs') || this.configuration?.endsWith('Publication');
    if (!this.isPersonEntity() || !isResearchOutputsConfiguration) {
      this.showSearchResultNotice$.next(false);
    } else {
      this.isProfileOwner().pipe(take(1)).subscribe((result) => {
        this.searchResultNotice = this.translateService.instant('manage.relationships.hidden-related-items-alert');
        this.showSearchResultNotice$.next(result);
      });
    }
  }

  protected getOwner(user: EPerson) {
    return this.item.firstMetadataValue('dspace.object.owner', { authority: user.id });
  }

  protected isProfileOwner(): Observable<boolean> {
    return this.authService.getAuthenticatedUserFromStore().pipe(
      filter(isNotEmpty),
      map((user) => isNotEmpty(this.getOwner(user))),
      shareReplay(1)
    );
  }

  protected isPersonEntity(): boolean {
    return isNotEmpty(this.item.firstMetadataValue('dspace.entity.type', { value: 'Person' }));
  }
}

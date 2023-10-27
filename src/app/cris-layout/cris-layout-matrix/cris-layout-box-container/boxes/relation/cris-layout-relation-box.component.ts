import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { hasValue } from '../../../../../shared/empty.util';
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
   * The width of the sidebar (bootstrap columns)
   */
  // sideBarWidth = 3;

  protected isResearcherProfileOwner$: Observable<boolean>;
  protected isResearchoutputs: boolean;

  showSearchResultNotice$: Observable<boolean>;
  searchResultNotice$: Observable<string>;

  constructor(public cd: ChangeDetectorRef,
              protected translateService: TranslateService,
              @Inject('boxProvider') public boxProvider: CrisLayoutBox,
              @Inject('itemProvider') public itemProvider: Item,
              protected authService: AuthService,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchFilter = `scope=${this.item.id}`;
    this.configuration = (this.box.configuration as RelationBoxConfiguration)['discovery-configuration'];
    this.isResearchoutputs =
      this.configuration?.endsWith('researchoutputs') || this.configuration?.endsWith('Publication');
    this.isResearcherProfileOwner$ = this.isResearcherProfileOwner();
    this.showSearchResultNotice$ = this.getShowSearchResultNotice();
    this.searchResultNotice$ = this.getSearchResultNotice();
  }

  protected getShowSearchResultNotice(): Observable<boolean> {
    return this.isResearcherProfileOwner$.pipe(filter(Boolean), shareReplay(1));
  }

  protected getSearchResultNotice(researcherProfileOwner$: Observable<boolean> = this.showSearchResultNotice$): Observable<string> {
    return researcherProfileOwner$
      .pipe(
        switchMap(() => this.translateService.get('manage.relationships.hidden-related-items-alert')),
        shareReplay(1)
      );
  }

  protected isResearcherProfileOwner(isResearchoutputs: boolean = this.isResearchoutputs): Observable<boolean> {
    return this.authService.getAuthenticatedUserFromStore()
      .pipe(
        filter(hasValue),
        map(user => isResearchoutputs && hasValue(this.getPersonEntity()) && hasValue(this.getOwner(user))),
        shareReplay(1)
      );
  }

  protected getOwner(user: EPerson) {
    return this.item.firstMetadataValue('dspace.object.owner', { authority: user.id });
  }

  protected getPersonEntity() {
    return this.item.firstMetadataValue('dspace.entity.type', { value: 'Person' });
  }
}

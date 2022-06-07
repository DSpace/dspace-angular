import {Component, Inject} from '@angular/core';
import {ResearcherProfileService} from '../../core/profile/researcher-profile.service';
import {ItemDataService} from '../../core/data/item-data.service';
import {ActivatedRoute} from '@angular/router';
import {NativeWindowRef, NativeWindowService} from '../../core/services/window.service';
import {getFirstCompletedRemoteData} from '../../core/shared/operators';
import {RemoteData} from '../../core/data/remote-data';
import {Item} from '../../core/shared/item.model';
import {getItemPageRoute} from '../item-page-routing-paths';

@Component({
  selector: 'ds-orcid-page',
  templateUrl: './orcid-page.component.html',
  styleUrls: ['./orcid-page.component.scss']
})
export class OrcidPageComponent  {

  item: Item;

  constructor(
    private itemService: ItemDataService,
    private researcherProfileService: ResearcherProfileService,
    private route: ActivatedRoute,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
  ) {
    this.itemService.findById(this.route.snapshot.paramMap.get('id'), true, true).pipe(getFirstCompletedRemoteData()).subscribe((data: RemoteData<Item>) => {
      this.item = data.payload;
    });
  }

  isLinkedToOrcid(): boolean {
    return this.researcherProfileService.isLinkedToOrcid(this.item);
  }

  getItemPage(): string {
    return getItemPageRoute(this.item);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { getItemPageRoute } from '../item-page-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { ItemDataService } from '../../core/data/item-data.service';

/**
 * A component that represents the orcid settings page
 */
@Component({
  selector: 'ds-orcid-page',
  templateUrl: './orcid-page.component.html',
  styleUrls: ['./orcid-page.component.scss']
})
export class OrcidPageComponent implements OnInit {

  /**
   * The item for which showing the orcid settings
   */
  item: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  constructor(
    private authService: AuthService,
    private itemService: ItemDataService,
    private researcherProfileService: ResearcherProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  /**
   * Retrieve the item for which showing the orcid settings
   */
  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    ).subscribe((item) => {
      this.item.next(item);
    });
  }

  /**
   * Check if the current item is linked to an ORCID profile.
   *
   * @returns the check result
   */
  isLinkedToOrcid(): boolean {
    return this.researcherProfileService.isLinkedToOrcid(this.item.value);
  }

  /**
   * Get the route to an item's page
   */
  getItemPage(): string {
    return getItemPageRoute(this.item.value);
  }

  /**
   * Retrieve the updated profile item
   */
  updateItem(): void {
    this.itemService.findById(this.item.value.id, false).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded) {
        this.item.next(itemRD.payload);
      }
    });
  }

}

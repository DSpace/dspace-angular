import { Component, OnInit } from '@angular/core';
import {Collection} from '../../core/shared/collection.model';
import {CollectionDataService} from '../../core/data/collection-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../core/shared/operators';
import {Community} from '../../core/shared/community.model';
import {CommunityDataService} from '../../core/data/community-data.service';

@Component({
  selector: 'ds-create-collection',
  styleUrls: ['./create-collection-page.component.scss'],
  templateUrl: './create-collection-page.component.html'
})
export class CreateCommunityPageComponent implements OnInit {

  public parentUUID$: Observable<string>;
  public parentRD$: Observable<RemoteData<Community>>;

  public constructor(
    private communityDataService: CommunityDataService,
    private collectionDataService: CollectionDataService,
    private routeService: RouteService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((parentID: string) => {
      if (isNotEmpty(parentID)) {
        this.parentRD$ = this.communityDataService.findById(parentID);
      }
    });
  }

  onSubmit(collection: Collection) {
    this.parentUUID$.pipe(take(1)).subscribe((uuid: string) => {
      this.collectionDataService.create(collection, uuid)
        .pipe(getSucceededRemoteData())
        .subscribe((collectionRD: RemoteData<Community>) => {
          if (isNotUndefined(collectionRD)) {
            const newUUID = collectionRD.payload.uuid;
            this.router.navigate(['/collections/' + newUUID]);
          }
        });
    });
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COLLECTION_PARENT_PARAMETER } from '../../../../+collection-page/collection-page-routing.module';

@Component({
  selector: 'ds-create-collection-parent-selector',
  // styleUrls: ['./create-collection-parent-selector.component.scss'],
  templateUrl: './create-collection-parent-selector.component.html',
})
export class CreateCollectionParentSelectorComponent implements OnInit {
  @Input() communityRD$: Observable<RemoteData<Community>>;
  type = DSpaceObjectType.COMMUNITY;

  private createPath = '/collections/create';

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.communityRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.community));
  }

  createCollection(dso: DSpaceObject) {
    this.activeModal.close();
    let navigationExtras: NavigationExtras = {
      queryParams: {
        [COLLECTION_PARENT_PARAMETER]: dso.uuid,
      }
    };
    this.router.navigate([this.createPath], navigationExtras);
  }
}

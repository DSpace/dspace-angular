import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { hasValue } from '../../../empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COMMUNITY_PARENT_PARAMETER } from '../../../../+community-page/community-page-routing.module';

@Component({
  selector: 'ds-create-community-parent-selector',
  // styleUrls: ['./create-community-parent-selector.component.scss'],
  templateUrl: './create-community-parent-selector.component.html',
})
export class CreateCommunityParentSelectorComponent implements OnInit {
  @Input() communityRD$: Observable<RemoteData<Community>>;
  type = DSpaceObjectType.COMMUNITY;

  private createPath = '/communities/create';

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.communityRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.community));
  }

  createCommunity(dso?: DSpaceObject) {
    this.activeModal.close();
    let navigationExtras: NavigationExtras = {};
    if (hasValue(dso)) {
      navigationExtras = {
        queryParams: {
          [COMMUNITY_PARENT_PARAMETER]: dso.uuid,
        }
      };
    }
    this.router.navigate([this.createPath], navigationExtras);
  }
}

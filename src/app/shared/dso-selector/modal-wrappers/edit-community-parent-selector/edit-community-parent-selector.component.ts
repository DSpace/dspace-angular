import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getCommunityEditPath } from '../../../../+community-page/community-page-routing.module';

@Component({
  selector: 'ds-edit-community-parent-selector',
  // styleUrls: ['./edit-community-parent-selector.component.scss'],
  templateUrl: './edit-community-parent-selector.component.html',
})
export class EditCommunityParentSelectorComponent implements OnInit {
  @Input() communityRD$: Observable<RemoteData<Community>>;
  type = DSpaceObjectType.COMMUNITY;

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.communityRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.collection));
  }

  editCommunity(dso: DSpaceObject) {
    this.activeModal.close();
    this.router.navigate([getCommunityEditPath(dso.uuid)]);
  }
}
